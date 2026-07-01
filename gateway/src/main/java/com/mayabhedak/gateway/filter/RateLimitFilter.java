package com.mayabhedak.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

/**
 * Rate Limiting Filter
 * 
 * Enforces request rate limits based on user subscription plan:
 * - FREE_TRIAL: 10 requests per minute
 * - PRO: 100 requests per minute
 * - ENTERPRISE: 1000 requests per minute
 */
@Component
public class RateLimitFilter implements GlobalFilter, Ordered {

    private final RedisTemplate<String, String> redisTemplate;
    
    // Rate limit configurations
    private static final int FREE_TRIAL_LIMIT = 10;
    private static final int PRO_LIMIT = 100;
    private static final int ENTERPRISE_LIMIT = 1000;
    private static final long WINDOW_SECONDS = 60;

    public RateLimitFilter(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getPath().value();
        
        // Skip rate limiting for health checks and public endpoints
        if (path.startsWith("/actuator") || 
            path.equals("/auth/register") || 
            path.equals("/auth/login") ||
            path.equals("/support/faq")) {
            return chain.filter(exchange);
        }

        // Extract user ID and plan from headers (set by JwtValidationFilter)
        String userId = request.getHeaders().getFirst("X-User-Id");
        String userPlan = request.getHeaders().getFirst("X-User-Plan");
        
        if (userId == null) {
            // No authentication - apply default limit
            userId = request.getRemoteAddress() != null ? 
                     request.getRemoteAddress().getAddress().getHostAddress() : "unknown";
            userPlan = "FREE_TRIAL";
        }

        // Determine rate limit based on plan
        int rateLimit = getRateLimitForPlan(userPlan);
        
        // Check rate limit
        String redisKey = "rate_limit:" + userId;
        Long currentCount = redisTemplate.opsForValue().increment(redisKey);
        
        if (currentCount == null) {
            currentCount = 0L;
        }
        
        // Set expiry on first request
        if (currentCount == 1) {
            redisTemplate.expire(redisKey, WINDOW_SECONDS, TimeUnit.SECONDS);
        }
        
        // Add rate limit headers
        ServerHttpResponse response = exchange.getResponse();
        response.getHeaders().add("X-RateLimit-Limit", String.valueOf(rateLimit));
        response.getHeaders().add("X-RateLimit-Remaining", 
                                   String.valueOf(Math.max(0, rateLimit - currentCount)));
        response.getHeaders().add("X-RateLimit-Reset", 
                                   String.valueOf(System.currentTimeMillis() / 1000 + WINDOW_SECONDS));
        
        // Check if limit exceeded
        if (currentCount > rateLimit) {
            response.setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
            response.getHeaders().add("Content-Type", "application/json");
            
            String errorMessage = String.format(
                "{\"error\":\"Rate limit exceeded\",\"limit\":%d,\"window\":\"60 seconds\",\"message\":\"Too many requests. Please try again later or upgrade your plan.\"}",
                rateLimit
            );
            
            return response.writeWith(Mono.just(response.bufferFactory().wrap(errorMessage.getBytes())));
        }
        
        return chain.filter(exchange);
    }

    private int getRateLimitForPlan(String plan) {
        if (plan == null) {
            return FREE_TRIAL_LIMIT;
        }
        
        switch (plan.toUpperCase()) {
            case "PRO":
                return PRO_LIMIT;
            case "ENTERPRISE":
                return ENTERPRISE_LIMIT;
            case "FREE_TRIAL":
            default:
                return FREE_TRIAL_LIMIT;
        }
    }

    @Override
    public int getOrder() {
        return 2; // Run after JWT validation (order 1)
    }
}
