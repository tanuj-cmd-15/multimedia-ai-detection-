package com.mayabhedak.auth.service;

import com.mayabhedak.auth.dto.PlanInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class TrialServiceClient {
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    @Value("${services.trial-service.url}")
    private String trialServiceUrl;
    
    /**
     * Initialize free trial for new user
     */
    public void initializeTrial(Long userId) {
        try {
            String url = trialServiceUrl + "/subscription/initialize";
            
            Map<String, Object> request = new HashMap<>();
            request.put("userId", userId);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(request, headers);
            
            restTemplate.postForEntity(url, entity, Void.class);
            log.info("Trial initialized successfully for user: {}", userId);
            
        } catch (Exception e) {
            log.error("Failed to initialize trial for user: {}", userId, e);
            throw new RuntimeException("Failed to initialize trial", e);
        }
    }
    
    /**
     * Get user's current plan information
     */
    public PlanInfo getUserPlan(Long userId) {
        try {
            String url = trialServiceUrl + "/subscription/plan?userId=" + userId;
            
            ResponseEntity<PlanInfo> response = restTemplate.getForEntity(url, PlanInfo.class);
            
            if (response.getBody() != null) {
                return response.getBody();
            }
            
            log.warn("No plan info found for user: {}, returning default", userId);
            return getDefaultPlanInfo();
            
        } catch (Exception e) {
            log.error("Failed to get plan info for user: {}", userId, e);
            return getDefaultPlanInfo();
        }
    }
    
    /**
     * Default plan info when trial service is unavailable
     */
    private PlanInfo getDefaultPlanInfo() {
        return PlanInfo.builder()
                .planType("FREE_TRIAL")
                .trialRequestsUsed(0)
                .trialRequestsLimit(50)
                .trialExpiresAt(LocalDate.now().plusDays(14))
                .status("ACTIVE")
                .build();
    }
}
