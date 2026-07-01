package com.swarparikshan.deepfake.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swarparikshan.deepfake.dto.ImagePredictionResponse;
import com.swarparikshan.deepfake.model.ImageAnalysis;
import com.swarparikshan.deepfake.model.User;
import com.swarparikshan.deepfake.service.AuthService;
import com.swarparikshan.deepfake.service.ImageAnalysisService;
import com.swarparikshan.deepfake.service.UsageLimitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ImageAnalysisController {
    
    @Autowired
    private ImageAnalysisService imageAnalysisService;
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private UsageLimitService usageLimitService;
    
    private static final String IMAGE_SERVICE_URL = "http://localhost:5001/predict";
    
    @PostMapping("/analyze-image")
    public ResponseEntity<?> analyzeImage(
            @RequestParam("image") MultipartFile file,
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
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                    .body(createErrorResponse("Invalid file type. Only image files are allowed."));
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
            
            // Call Python image service
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("image", file.getResource());
            
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            
            ResponseEntity<Map> pythonResponse = restTemplate.exchange(
                IMAGE_SERVICE_URL,
                HttpMethod.POST,
                requestEntity,
                Map.class
            );
            
            Map<String, Object> predictionResult = pythonResponse.getBody();
            
            if (predictionResult == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Failed to get prediction from image service"));
            }
            
            // Save analysis to database
            ImageAnalysis savedAnalysis = imageAnalysisService.saveAnalysis(
                predictionResult, 
                file.getOriginalFilename(), 
                user
            );
            
            // Convert to response format
            ImagePredictionResponse response = imageAnalysisService.getAnalysisById(savedAnalysis.getId());
            
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
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Unexpected error: " + e.getMessage()));
        }
    }
    
    @GetMapping("/image-analyses")
    public ResponseEntity<?> getAllImageAnalyses(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail) {
        try {
            List<ImagePredictionResponse> analyses;
            if (userEmail != null && !userEmail.isEmpty()) {
                User user = authService.getUserByEmail(userEmail);
                if (user != null) {
                    analyses = imageAnalysisService.getUserAnalyses(user);
                } else {
                    analyses = imageAnalysisService.getAllAnalyses();
                }
            } else {
                analyses = imageAnalysisService.getAllAnalyses();
            }
            return ResponseEntity.ok(analyses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Error fetching image analyses: " + e.getMessage()));
        }
    }
    
    @GetMapping("/image-analyses/recent")
    public ResponseEntity<?> getRecentImageAnalyses(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail) {
        try {
            List<ImagePredictionResponse> analyses;
            if (userEmail != null && !userEmail.isEmpty()) {
                User user = authService.getUserByEmail(userEmail);
                if (user != null) {
                    analyses = imageAnalysisService.getRecentUserAnalyses(user);
                } else {
                    analyses = imageAnalysisService.getRecentAnalyses();
                }
            } else {
                analyses = imageAnalysisService.getRecentAnalyses();
            }
            return ResponseEntity.ok(analyses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Error fetching image analyses: " + e.getMessage()));
        }
    }
    
    @GetMapping("/image-analyses/{id}")
    public ResponseEntity<?> getImageAnalysisById(@PathVariable Long id) {
        try {
            ImagePredictionResponse response = imageAnalysisService.getAnalysisById(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(createErrorResponse("Image analysis not found with id: " + id));
        }
    }
    
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return error;
    }
}
