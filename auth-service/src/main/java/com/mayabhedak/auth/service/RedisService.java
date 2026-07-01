package com.mayabhedak.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class RedisService {
    
    private final RedisTemplate<String, Object> redisTemplate;
    private final StringRedisTemplate stringRedisTemplate;
    
    private static final String OTP_PREFIX = "otp:";
    private static final String OTP_ATTEMPT_PREFIX = "otp:attempt:";
    private static final String JWT_BLACKLIST_PREFIX = "jwt:blacklist:";
    private static final String RATE_LIMIT_PREFIX = "rate:limit:";
    private static final String VERIFICATION_CODE_PREFIX = "verify:email:";
    
    /**
     * Store OTP with expiration (5 minutes)
     */
    public void storeOTP(String mobileNumber, String otp, long expirationSeconds) {
        String key = OTP_PREFIX + mobileNumber;
        stringRedisTemplate.opsForValue().set(key, otp, expirationSeconds, TimeUnit.SECONDS);
        log.debug("OTP stored for mobile: {} with expiration: {}s", mobileNumber, expirationSeconds);
    }
    
    /**
     * Get OTP for mobile number
     */
    public String getOTP(String mobileNumber) {
        String key = OTP_PREFIX + mobileNumber;
        return stringRedisTemplate.opsForValue().get(key);
    }
    
    /**
     * Delete OTP after successful verification
     */
    public void deleteOTP(String mobileNumber) {
        String key = OTP_PREFIX + mobileNumber;
        stringRedisTemplate.delete(key);
        log.debug("OTP deleted for mobile: {}", mobileNumber);
    }
    
    /**
     * Increment OTP verification attempt counter
     */
    public Long incrementOTPAttempt(String mobileNumber) {
        String key = OTP_ATTEMPT_PREFIX + mobileNumber;
        Long attempts = stringRedisTemplate.opsForValue().increment(key);
        stringRedisTemplate.expire(key, 5, TimeUnit.MINUTES);
        return attempts;
    }
    
    /**
     * Reset OTP attempt counter
     */
    public void resetOTPAttempt(String mobileNumber) {
        String key = OTP_ATTEMPT_PREFIX + mobileNumber;
        stringRedisTemplate.delete(key);
    }
    
    /**
     * Check if OTP request rate limit exceeded
     */
    public boolean isOTPRateLimitExceeded(String mobileNumber, int maxRequests, long windowSeconds) {
        String key = RATE_LIMIT_PREFIX + "otp:" + mobileNumber;
        String value = stringRedisTemplate.opsForValue().get(key);
        
        if (value == null) {
            stringRedisTemplate.opsForValue().set(key, "1", windowSeconds, TimeUnit.SECONDS);
            return false;
        }
        
        int requestCount = Integer.parseInt(value);
        if (requestCount >= maxRequests) {
            log.warn("OTP rate limit exceeded for mobile: {}", mobileNumber);
            return true;
        }
        
        stringRedisTemplate.opsForValue().increment(key);
        return false;
    }
    
    /**
     * Add JWT token to blacklist (for logout)
     */
    public void blacklistToken(String tokenId, long expirationSeconds) {
        String key = JWT_BLACKLIST_PREFIX + tokenId;
        stringRedisTemplate.opsForValue().set(key, "blacklisted", expirationSeconds, TimeUnit.SECONDS);
        log.debug("JWT token blacklisted: {}", tokenId);
    }
    
    /**
     * Check if JWT token is blacklisted
     */
    public boolean isTokenBlacklisted(String tokenId) {
        String key = JWT_BLACKLIST_PREFIX + tokenId;
        return Boolean.TRUE.equals(stringRedisTemplate.hasKey(key));
    }
    
    /**
     * Check login rate limit
     */
    public boolean isLoginRateLimitExceeded(String email, int maxAttempts, long windowSeconds) {
        String key = RATE_LIMIT_PREFIX + "login:" + email;
        String value = stringRedisTemplate.opsForValue().get(key);
        
        if (value == null) {
            stringRedisTemplate.opsForValue().set(key, "1", windowSeconds, TimeUnit.SECONDS);
            return false;
        }
        
        int attemptCount = Integer.parseInt(value);
        if (attemptCount >= maxAttempts) {
            log.warn("Login rate limit exceeded for email: {}", email);
            return true;
        }
        
        stringRedisTemplate.opsForValue().increment(key);
        return false;
    }
    
    /**
     * Reset login rate limit after successful login
     */
    public void resetLoginRateLimit(String email) {
        String key = RATE_LIMIT_PREFIX + "login:" + email;
        stringRedisTemplate.delete(key);
    }
    
    /**
     * Store email verification code
     */
    public void storeEmailVerificationCode(String email, String code, long expirationSeconds) {
        String key = VERIFICATION_CODE_PREFIX + email;
        stringRedisTemplate.opsForValue().set(key, code, expirationSeconds, TimeUnit.SECONDS);
        log.debug("Email verification code stored for: {}", email);
    }
    
    /**
     * Get email verification code
     */
    public String getEmailVerificationCode(String email) {
        String key = VERIFICATION_CODE_PREFIX + email;
        return stringRedisTemplate.opsForValue().get(key);
    }
    
    /**
     * Delete email verification code after successful verification
     */
    public void deleteEmailVerificationCode(String email) {
        String key = VERIFICATION_CODE_PREFIX + email;
        stringRedisTemplate.delete(key);
        log.debug("Email verification code deleted for: {}", email);
    }
}
