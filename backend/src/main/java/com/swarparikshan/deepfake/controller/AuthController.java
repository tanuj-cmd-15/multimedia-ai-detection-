package com.swarparikshan.deepfake.controller;

import com.swarparikshan.deepfake.dto.AuthResponse;
import com.swarparikshan.deepfake.dto.LoginRequest;
import com.swarparikshan.deepfake.dto.RegisterRequest;
import com.swarparikshan.deepfake.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            if (response.getUserId() != null) {
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", response.getMessage());
                return ResponseEntity.badRequest().body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Registration failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            if (response.getUserId() != null) {
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", response.getMessage());
                return ResponseEntity.badRequest().body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Login failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
    
    @PostMapping("/regenerate-api-key/{userId}")
    public ResponseEntity<?> regenerateApiKey(@PathVariable Long userId) {
        try {
            String newApiKey = authService.regenerateApiKey(userId);
            if (newApiKey != null) {
                Map<String, String> response = new HashMap<>();
                response.put("apiKey", newApiKey);
                response.put("message", "API key regenerated successfully");
                return ResponseEntity.ok(response);
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("error", "User not found");
                return ResponseEntity.badRequest().body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to regenerate API key: " + e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }
}
