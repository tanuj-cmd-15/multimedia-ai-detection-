package com.mayabhedak.gateway.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * Health Check Controller
 * 
 * Aggregates health status from all microservices and returns overall system health
 */
@RestController
public class HealthController {

    private final WebClient webClient;
    
    @Value("${services.auth.url:http://localhost:8082}")
    private String authServiceUrl;
    
    @Value("${services.trial.url:http://localhost:8083}")
    private String trialServiceUrl;
    
    @Value("${services.backend.url:http://localhost:8081}")
    private String backendServiceUrl;
    
    @Value("${services.support.url:http://localhost:8084}")
    private String supportServiceUrl;
    
    @Value("${services.notification.url:http://localhost:8085}")
    private String notificationServiceUrl;

    public HealthController(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .defaultHeader("User-Agent", "Gateway-Health-Check")
                .build();
    }

    @GetMapping("/health")
    public Mono<ResponseEntity<Map<String, Object>>> health() {
        Map<String, Object> healthStatus = new HashMap<>();
        healthStatus.put("gateway", "UP");
        healthStatus.put("timestamp", System.currentTimeMillis());
        
        return Mono.zip(
                checkServiceHealth("auth", authServiceUrl + "/actuator/health"),
                checkServiceHealth("trial", trialServiceUrl + "/actuator/health"),
                checkServiceHealth("backend", backendServiceUrl + "/api/health"),
                checkServiceHealth("support", supportServiceUrl + "/health"),
                checkServiceHealth("notification", notificationServiceUrl + "/health")
        ).map(tuple -> {
            Map<String, Object> services = new HashMap<>();
            services.put("auth-service", tuple.getT1());
            services.put("trial-service", tuple.getT2());
            services.put("backend-service", tuple.getT3());
            services.put("support-service", tuple.getT4());
            services.put("notification-service", tuple.getT5());
            
            healthStatus.put("services", services);
            
            // Determine overall status
            boolean allHealthy = services.values().stream()
                    .allMatch(status -> "UP".equals(((Map<?, ?>) status).get("status")));
            
            healthStatus.put("status", allHealthy ? "UP" : "DEGRADED");
            
            HttpStatus responseStatus = allHealthy ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
            return ResponseEntity.status(responseStatus).body(healthStatus);
        }).onErrorResume(error -> {
            healthStatus.put("status", "DOWN");
            healthStatus.put("error", error.getMessage());
            return Mono.just(ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(healthStatus));
        });
    }

    private Mono<Map<String, Object>> checkServiceHealth(String serviceName, String healthUrl) {
        return webClient.get()
                .uri(healthUrl)
                .retrieve()
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(5))
                .map(response -> {
                    Map<String, Object> serviceHealth = new HashMap<>();
                    serviceHealth.put("status", "UP");
                    serviceHealth.put("details", response);
                    return serviceHealth;
                })
                .onErrorResume(error -> {
                    Map<String, Object> serviceHealth = new HashMap<>();
                    serviceHealth.put("status", "DOWN");
                    serviceHealth.put("error", error.getMessage());
                    return Mono.just(serviceHealth);
                });
    }
}
