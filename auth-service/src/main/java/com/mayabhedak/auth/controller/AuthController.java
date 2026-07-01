package com.mayabhedak.auth.controller;

import com.mayabhedak.auth.dto.*;
import com.mayabhedak.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {
    
    private final AuthService authService;
    
    /**
     * Register new user with email and password
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registration request received for email: {}", request.getEmail());
        
        UserResponse user = authService.register(request);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Registration successful. Please check your email for verification code.");
        response.put("user", user);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    /**
     * Verify email with code
     */
    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, String>> verifyEmail(
            @RequestParam String email,
            @RequestParam String code
    ) {
        log.info("Email verification request for: {}", email);
        
        authService.verifyEmail(email, code);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Email verified successfully");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Login with email and password
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request received for email: {}", request.getEmail());
        
        LoginResponse response = authService.login(request);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Request OTP for mobile login
     */
    @PostMapping("/otp/request")
    public ResponseEntity<OTPResponse> requestOTP(@Valid @RequestBody OTPRequest request) {
        log.info("OTP request received for mobile: {}", request.getMobileNumber());
        
        OTPResponse response = authService.requestOTP(request);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Verify OTP and login
     */
    @PostMapping("/otp/verify")
    public ResponseEntity<LoginResponse> verifyOTP(@Valid @RequestBody OTPVerifyRequest request) {
        log.info("OTP verification request for mobile: {}", request.getMobileNumber());
        
        LoginResponse response = authService.verifyOTP(request);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Refresh access token
     */
    @PostMapping("/refresh-token")
    public ResponseEntity<LoginResponse> refreshToken(@RequestHeader("Authorization") String authHeader) {
        log.info("Token refresh request received");
        
        String refreshToken = extractToken(authHeader);
        LoginResponse response = authService.refreshToken(refreshToken);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Logout
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@RequestHeader("Authorization") String authHeader) {
        log.info("Logout request received");
        
        String token = extractToken(authHeader);
        authService.logout(token);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logged out successfully");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get current user info
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        // TODO: Extract userId from JWT in auth header
        // For now, return a placeholder
        log.info("Get current user request received");
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Not implemented yet - requires JWT validation in gateway");
        
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }
    
    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "auth-service");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Extract token from Authorization header
     */
    private String extractToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        throw new IllegalArgumentException("Invalid Authorization header");
    }
}
