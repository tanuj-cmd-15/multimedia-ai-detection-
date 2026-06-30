package com.swarparikshan.deepfake.controller;

import com.swarparikshan.deepfake.dto.PredictionResponse;
import com.swarparikshan.deepfake.model.User;
import com.swarparikshan.deepfake.service.AudioAnalysisService;
import com.swarparikshan.deepfake.service.AuthService;
import com.swarparikshan.deepfake.service.UsageLimitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AudioAnalysisController {
    
    @Autowired
    private AudioAnalysisService audioAnalysisService;
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private UsageLimitService usageLimitService;
    
    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeAudio(
            @RequestParam("audio") MultipartFile file,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-Machine-Id", required = false) String machineId,
            @RequestHeader(value = "X-API-Key", required = false) String apiKey) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("No file provided"));
            }
            
            // Validate file type
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("audio/")) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Invalid file type. Only audio files are allowed."));
            }
            
            User user = null;
            
            // Check if user is authenticated via API key
            if (apiKey != null && !apiKey.isEmpty()) {
                user = authService.getUserByApiKey(apiKey);
                if (user == null) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("Invalid API key"));
                }
            } 
            // Check if user is authenticated via email
            else if (userEmail != null && !userEmail.isEmpty()) {
                user = authService.getUserByEmail(userEmail);
            }
            
            // If not authenticated, check usage limits
            if (user == null) {
                String identifier = userEmail != null ? userEmail : machineId;
                String identifierType = userEmail != null ? "EMAIL" : "MACHINE_ID";
                
                if (identifier == null || identifier.isEmpty()) {
                    return ResponseEntity.badRequest()
                        .body(createErrorResponse("Email or Machine ID required for demo usage"));
                }
                
                if (!usageLimitService.checkAndIncrementUsage(identifier, identifierType)) {
                    int remaining = usageLimitService.getRemainingUsage(identifier);
                    Map<String, Object> error = new HashMap<>();
                    error.put("error", "Demo limit exceeded. Please login or register to continue.");
                    error.put("limit_exceeded", true);
                    error.put("remaining", remaining);
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
                }
            }
            
            PredictionResponse response = audioAnalysisService.analyzeAudio(file, user);
            
            // Add remaining usage info for demo users
            if (user == null) {
                String identifier = userEmail != null ? userEmail : machineId;
                int remaining = usageLimitService.getRemainingUsage(identifier);
                Map<String, Object> responseWithLimit = new HashMap<>();
                responseWithLimit.put("analysis", response);
                responseWithLimit.put("demo_remaining", remaining);
                return ResponseEntity.ok(responseWithLimit);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Error processing audio file: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Unexpected error: " + e.getMessage()));
        }
    }
    
    @GetMapping("/analyses")
    public ResponseEntity<?> getAllAnalyses(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail) {
        try {
            List<PredictionResponse> analyses;
            if (userEmail != null && !userEmail.isEmpty()) {
                User user = authService.getUserByEmail(userEmail);
                if (user != null) {
                    analyses = audioAnalysisService.getUserAnalyses(user);
                } else {
                    analyses = audioAnalysisService.getAllAnalyses();
                }
            } else {
                analyses = audioAnalysisService.getAllAnalyses();
            }
            return ResponseEntity.ok(analyses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Error fetching analyses: " + e.getMessage()));
        }
    }
    
    @GetMapping("/analyses/recent")
    public ResponseEntity<?> getRecentAnalyses(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail) {
        try {
            List<PredictionResponse> analyses;
            if (userEmail != null && !userEmail.isEmpty()) {
                User user = authService.getUserByEmail(userEmail);
                if (user != null) {
                    analyses = audioAnalysisService.getRecentUserAnalyses(user);
                } else {
                    analyses = audioAnalysisService.getRecentAnalyses();
                }
            } else {
                analyses = audioAnalysisService.getRecentAnalyses();
            }
            return ResponseEntity.ok(analyses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Error fetching analyses: " + e.getMessage()));
        }
    }
    
    @GetMapping("/analyses/{id}")
    public ResponseEntity<?> getAnalysisById(@PathVariable Long id) {
        try {
            PredictionResponse response = audioAnalysisService.getAnalysisById(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(createErrorResponse("Analysis not found with id: " + id));
        }
    }
    
    @GetMapping("/usage-limit")
    public ResponseEntity<?> getUsageLimit(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-Machine-Id", required = false) String machineId) {
        try {
            String identifier = userEmail != null ? userEmail : machineId;
            if (identifier == null || identifier.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Email or Machine ID required"));
            }
            
            int remaining = usageLimitService.getRemainingUsage(identifier);
            Map<String, Object> response = new HashMap<>();
            response.put("remaining", remaining);
            response.put("limit", 3);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Error checking usage limit: " + e.getMessage()));
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("service", "SwarParikshan Audio Deepfake Detection");
        return ResponseEntity.ok(response);
    }
    
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
