package com.mayabhedak.auth.service;

import com.mayabhedak.auth.dto.*;
import com.mayabhedak.auth.exception.AuthenticationException;
import com.mayabhedak.auth.exception.RateLimitExceededException;
import com.mayabhedak.auth.exception.ValidationException;
import com.mayabhedak.auth.model.AuthProvider;
import com.mayabhedak.auth.model.User;
import com.mayabhedak.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordValidator passwordValidator;
    private final JwtService jwtService;
    private final RedisService redisService;
    private final TwilioService twilioService;
    private final TrialServiceClient trialServiceClient;
    
    @Value("${rate-limit.login.max-attempts}")
    private int maxLoginAttempts;
    
    @Value("${rate-limit.login.window-seconds}")
    private long loginWindowSeconds;
    
    @Value("${rate-limit.otp.max-requests}")
    private int maxOtpRequests;
    
    @Value("${rate-limit.otp.window-seconds}")
    private long otpWindowSeconds;
    
    private static final long OTP_EXPIRATION_SECONDS = 300; // 5 minutes
    private static final long EMAIL_VERIFICATION_EXPIRATION_SECONDS = 900; // 15 minutes
    private static final int MAX_OTP_ATTEMPTS = 3;
    
    private final Random random = new SecureRandom();
    
    /**
     * Register new user with email and password
     */
    @Transactional
    public UserResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());
        
        // Validate password
        PasswordValidator.ValidationResult validationResult = passwordValidator.validate(request.getPassword());
        if (!validationResult.isValid()) {
            throw new ValidationException("Password validation failed: " + validationResult.getErrorMessage());
        }
        
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException("Email already registered");
        }
        
        // Create new user
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .mobileNumber(request.getMobileNumber())
                .authProvider(AuthProvider.EMAIL)
                .emailVerified(false)
                .mobileVerified(false)
                .build();
        
        user = userRepository.save(user);
        log.info("User registered successfully with ID: {}", user.getId());
        
        // Generate and store email verification code
        String verificationCode = generateVerificationCode();
        redisService.storeEmailVerificationCode(user.getEmail(), verificationCode, EMAIL_VERIFICATION_EXPIRATION_SECONDS);
        
        // Initialize free trial (call trial-service)
        try {
            trialServiceClient.initializeTrial(user.getId());
            log.info("Free trial initialized for user: {}", user.getId());
        } catch (Exception e) {
            log.error("Failed to initialize trial for user: {}", user.getId(), e);
            // Don't fail registration if trial initialization fails
        }
        
        // TODO: Send welcome email with verification code via notification service
        
        return UserResponse.fromUser(user);
    }
    
    /**
     * Verify email with code
     */
    @Transactional
    public void verifyEmail(String email, String code) {
        log.info("Verifying email: {}", email);
        
        String storedCode = redisService.getEmailVerificationCode(email);
        if (storedCode == null) {
            throw new ValidationException("Verification code expired or not found");
        }
        
        if (!storedCode.equals(code)) {
            throw new ValidationException("Invalid verification code");
        }
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ValidationException("User not found"));
        
        user.setEmailVerified(true);
        userRepository.save(user);
        
        redisService.deleteEmailVerificationCode(email);
        log.info("Email verified successfully for: {}", email);
    }
    
    /**
     * Login with email and password
     */
    @Transactional
    public LoginResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        
        // Check rate limiting
        if (redisService.isLoginRateLimitExceeded(request.getEmail(), maxLoginAttempts, loginWindowSeconds)) {
            throw new RateLimitExceededException("Too many login attempts. Please try again later.");
        }
        
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthenticationException("Invalid email or password"));
        
        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            log.warn("Invalid password for email: {}", request.getEmail());
            throw new AuthenticationException("Invalid email or password");
        }
        
        // Update last login timestamp
        user.updateLastLogin();
        userRepository.save(user);
        
        // Reset rate limit after successful login
        redisService.resetLoginRateLimit(request.getEmail());
        
        // Get user's plan info from trial service
        PlanInfo planInfo = trialServiceClient.getUserPlan(user.getId());
        
        // Generate JWT tokens
        String accessToken = jwtService.generateAccessToken(user, planInfo.getPlanType());
        String refreshToken = jwtService.generateRefreshToken(user);
        
        log.info("Login successful for user: {}", user.getId());
        
        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtService.getAccessTokenExpirationInSeconds())
                .user(UserResponse.fromUser(user))
                .plan(planInfo)
                .build();
    }
    
    /**
     * Request OTP for mobile login
     */
    public OTPResponse requestOTP(OTPRequest request) {
        log.info("OTP requested for mobile: {}", request.getMobileNumber());
        
        // Validate phone number format
        if (!twilioService.isValidPhoneNumber(request.getMobileNumber())) {
            throw new ValidationException("Invalid phone number format. Must be in E.164 format (e.g., +919876543210)");
        }
        
        // Check rate limiting
        if (redisService.isOTPRateLimitExceeded(request.getMobileNumber(), maxOtpRequests, otpWindowSeconds)) {
            throw new RateLimitExceededException("Too many OTP requests. Please try again later.");
        }
        
        // Generate 6-digit OTP
        String otp = String.format("%06d", random.nextInt(1000000));
        
        // Store OTP in Redis
        redisService.storeOTP(request.getMobileNumber(), otp, OTP_EXPIRATION_SECONDS);
        redisService.resetOTPAttempt(request.getMobileNumber());
        
        // Send OTP via SMS
        try {
            twilioService.sendOTP(request.getMobileNumber(), otp);
            log.info("OTP sent successfully to: {}", request.getMobileNumber());
        } catch (Exception e) {
            log.error("Failed to send OTP to: {}", request.getMobileNumber(), e);
            throw new RuntimeException("Failed to send OTP. Please try again.");
        }
        
        return OTPResponse.builder()
                .message("OTP sent successfully")
                .expiresIn((int) OTP_EXPIRATION_SECONDS)
                .mobileNumber(request.getMobileNumber())
                .build();
    }
    
    /**
     * Verify OTP and login
     */
    @Transactional
    public LoginResponse verifyOTP(OTPVerifyRequest request) {
        log.info("OTP verification for mobile: {}", request.getMobileNumber());
        
        // Get stored OTP
        String storedOtp = redisService.getOTP(request.getMobileNumber());
        if (storedOtp == null) {
            throw new ValidationException("OTP expired or not found. Please request a new OTP.");
        }
        
        // Check attempt limit
        Long attempts = redisService.incrementOTPAttempt(request.getMobileNumber());
        if (attempts > MAX_OTP_ATTEMPTS) {
            redisService.deleteOTP(request.getMobileNumber());
            throw new ValidationException("Maximum OTP verification attempts exceeded. Please request a new OTP.");
        }
        
        // Verify OTP
        if (!storedOtp.equals(request.getOtp())) {
            log.warn("Invalid OTP for mobile: {}", request.getMobileNumber());
            throw new ValidationException("Invalid OTP. Attempts remaining: " + (MAX_OTP_ATTEMPTS - attempts));
        }
        
        // OTP verified successfully - delete from Redis
        redisService.deleteOTP(request.getMobileNumber());
        redisService.resetOTPAttempt(request.getMobileNumber());
        
        // Find or create user
        User user = userRepository.findByMobileNumber(request.getMobileNumber())
                .orElseGet(() -> {
                    log.info("Creating new user for mobile: {}", request.getMobileNumber());
                    User newUser = User.builder()
                            .mobileNumber(request.getMobileNumber())
                            .fullName("User " + request.getMobileNumber().substring(Math.max(0, request.getMobileNumber().length() - 4)))
                            .authProvider(AuthProvider.MOBILE)
                            .emailVerified(false)
                            .mobileVerified(true)
                            .build();
                    
                    User savedUser = userRepository.save(newUser);
                    
                    // Initialize free trial
                    try {
                        trialServiceClient.initializeTrial(savedUser.getId());
                    } catch (Exception e) {
                        log.error("Failed to initialize trial for user: {}", savedUser.getId(), e);
                    }
                    
                    return savedUser;
                });
        
        // Update last login
        user.updateLastLogin();
        user.setMobileVerified(true);
        userRepository.save(user);
        
        // Get plan info
        PlanInfo planInfo = trialServiceClient.getUserPlan(user.getId());
        
        // Generate tokens
        String accessToken = jwtService.generateAccessToken(user, planInfo.getPlanType());
        String refreshToken = jwtService.generateRefreshToken(user);
        
        log.info("OTP verification successful for user: {}", user.getId());
        
        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtService.getAccessTokenExpirationInSeconds())
                .user(UserResponse.fromUser(user))
                .plan(planInfo)
                .build();
    }
    
    /**
     * Logout - blacklist JWT token
     */
    public void logout(String token) {
        String tokenId = jwtService.extractTokenId(token);
        long expirationSeconds = (jwtService.getExpirationDate(token).getTime() - System.currentTimeMillis()) / 1000;
        redisService.blacklistToken(tokenId, expirationSeconds);
        log.info("User logged out, token blacklisted: {}", tokenId);
    }
    
    /**
     * Refresh access token
     */
    public LoginResponse refreshToken(String refreshToken) {
        if (!jwtService.validateToken(refreshToken)) {
            throw new AuthenticationException("Invalid or expired refresh token");
        }
        
        Long userId = jwtService.extractUserId(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthenticationException("User not found"));
        
        // Get plan info
        PlanInfo planInfo = trialServiceClient.getUserPlan(user.getId());
        
        // Generate new tokens
        String newAccessToken = jwtService.generateAccessToken(user, planInfo.getPlanType());
        String newRefreshToken = jwtService.generateRefreshToken(user);
        
        // Blacklist old refresh token
        String oldTokenId = jwtService.extractTokenId(refreshToken);
        long expirationSeconds = (jwtService.getExpirationDate(refreshToken).getTime() - System.currentTimeMillis()) / 1000;
        redisService.blacklistToken(oldTokenId, expirationSeconds);
        
        log.info("Token refreshed for user: {}", user.getId());
        
        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtService.getAccessTokenExpirationInSeconds())
                .user(UserResponse.fromUser(user))
                .plan(planInfo)
                .build();
    }
    
    /**
     * Get current user info
     */
    public UserResponse getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthenticationException("User not found"));
        return UserResponse.fromUser(user);
    }
    
    /**
     * Generate 6-digit verification code
     */
    private String generateVerificationCode() {
        return String.format("%06d", random.nextInt(1000000));
    }
}
