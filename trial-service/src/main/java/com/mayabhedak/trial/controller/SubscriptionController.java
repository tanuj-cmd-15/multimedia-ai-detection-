package com.mayabhedak.trial.controller;

import com.mayabhedak.trial.dto.*;
import com.mayabhedak.trial.model.DetectionType;
import com.mayabhedak.trial.service.TrialService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/subscription")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class SubscriptionController {
    
    private final TrialService trialService;
    
    /**
     * Initialize free trial for new user (called by auth-service)
     */
    @PostMapping("/initialize")
    public ResponseEntity<PlanDetails> initializeTrial(@Valid @RequestBody InitializeTrialRequest request) {
        log.info("Initialize trial request for user: {}", request.getUserId());
        
        PlanDetails planDetails = trialService.initializeTrial(request.getUserId());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(planDetails);
    }
    
    /**
     * Get current plan for user
     */
    @GetMapping("/plan")
    public ResponseEntity<PlanDetails> getCurrentPlan(@RequestParam Long userId) {
        log.info("Get plan request for user: {}", userId);
        
        PlanDetails planDetails = trialService.getCurrentPlan(userId);
        
        return ResponseEntity.ok(planDetails);
    }
    
    /**
     * Get usage statistics
     */
    @GetMapping("/usage")
    public ResponseEntity<UsageStats> getUsageStats(@RequestParam Long userId) {
        log.info("Get usage stats for user: {}", userId);
        
        UsageStats stats = trialService.getUsageStats(userId);
        
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Check quota before detection (called by gateway/backend)
     */
    @GetMapping("/quota/check")
    public ResponseEntity<QuotaCheckResponse> checkQuota(
            @RequestParam Long userId,
            @RequestParam DetectionType detectionType) {
        log.debug("Check quota for user: {}, type: {}", userId, detectionType);
        
        QuotaCheckResponse response = trialService.checkQuota(userId, detectionType);
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Increment usage after successful detection
     */
    @PostMapping("/usage/increment")
    public ResponseEntity<Map<String, String>> incrementUsage(
            @RequestParam Long userId,
            @RequestParam DetectionType detectionType) {
        log.debug("Increment usage for user: {}, type: {}", userId, detectionType);
        
        trialService.incrementUsage(userId, detectionType);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Usage incremented successfully");
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Health check
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "trial-service");
        
        return ResponseEntity.ok(response);
    }
}
