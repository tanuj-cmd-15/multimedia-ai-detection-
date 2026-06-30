package com.swarparikshan.deepfake.service;

import com.swarparikshan.deepfake.dto.AuthResponse;
import com.swarparikshan.deepfake.dto.LoginRequest;
import com.swarparikshan.deepfake.dto.RegisterRequest;
import com.swarparikshan.deepfake.model.User;
import com.swarparikshan.deepfake.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            AuthResponse response = new AuthResponse();
            response.setMessage("Email already registered");
            return response;
        }
        
        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // In production, hash this!
        user.setName(request.getName());
        user.setUserType(User.UserType.valueOf(request.getUserType()));
        user.setOrganizationName(request.getOrganizationName());
        user.setApiKey(generateApiKey());
        user.setApiCallsRemaining(null); // Unlimited for registered users
        user.setCreatedAt(LocalDateTime.now());
        user.setActive(true);
        
        user = userRepository.save(user);
        
        return createAuthResponse(user, "Registration successful");
    }
    
    public AuthResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (!userOpt.isPresent()) {
            AuthResponse response = new AuthResponse();
            response.setMessage("Invalid email or password");
            return response;
        }
        
        User user = userOpt.get();
        
        // In production, use proper password hashing and comparison
        if (!user.getPassword().equals(request.getPassword())) {
            AuthResponse response = new AuthResponse();
            response.setMessage("Invalid email or password");
            return response;
        }
        
        // Update last login
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
        
        return createAuthResponse(user, "Login successful");
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
    
    public User getUserByApiKey(String apiKey) {
        return userRepository.findByApiKey(apiKey).orElse(null);
    }
    
    public String regenerateApiKey(Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String newApiKey = generateApiKey();
            user.setApiKey(newApiKey);
            userRepository.save(user);
            return newApiKey;
        }
        return null;
    }
    
    private String generateApiKey() {
        return "sk_" + UUID.randomUUID().toString().replace("-", "");
    }
    
    private AuthResponse createAuthResponse(User user, String message) {
        AuthResponse response = new AuthResponse();
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setUserType(user.getUserType().toString());
        response.setOrganizationName(user.getOrganizationName());
        response.setApiKey(user.getApiKey());
        response.setApiCallsRemaining(user.getApiCallsRemaining());
        response.setToken(generateToken(user)); // Simple token for demo
        response.setMessage(message);
        return response;
    }
    
    private String generateToken(User user) {
        // In production, use JWT or proper session tokens
        return "token_" + user.getId() + "_" + System.currentTimeMillis();
    }
}
