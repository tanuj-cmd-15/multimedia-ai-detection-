package com.mayabhedak.gateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.UUID;

/**
 * Security Headers Filter
 * 
 * Adds security headers to all responses to protect against common web vulnerabilities:
 * - HSTS (HTTP Strict Transport Security)
 * - CSP (Content Security Policy)
 * - X-Frame-Options (Clickjacking protection)
 * - X-Content-Type-Options (MIME sniffing protection)
 * - X-XSS-Protection (XSS protection for legacy browsers)
 * - Referrer-Policy (Control referrer information)
 */
@Component
public class SecurityHeadersFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            ServerHttpResponse response = exchange.getResponse();
            
            // Add security headers
            response.getHeaders().add("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
            response.getHeaders().add("Content-Security-Policy", "default-src 'self'");
            response.getHeaders().add("X-Frame-Options", "DENY");
            response.getHeaders().add("X-Content-Type-Options", "nosniff");
            response.getHeaders().add("X-XSS-Protection", "1; mode=block");
            response.getHeaders().add("Referrer-Policy", "strict-origin-when-cross-origin");
            
            // Add request tracking header if not already present
            if (!response.getHeaders().containsKey("X-Request-ID")) {
                String requestId = exchange.getRequest().getHeaders().getFirst("X-Request-ID");
                if (requestId == null) {
                    requestId = UUID.randomUUID().toString();
                }
                response.getHeaders().add("X-Request-ID", requestId);
            }
            
            // Remove server identification headers
            response.getHeaders().remove("Server");
            response.getHeaders().remove("X-Powered-By");
            
            // Add CORS headers for frontend
            String origin = exchange.getRequest().getHeaders().getFirst("Origin");
            if (origin != null && isAllowedOrigin(origin)) {
                response.getHeaders().add("Access-Control-Allow-Origin", origin);
                response.getHeaders().add("Access-Control-Allow-Credentials", "true");
                response.getHeaders().add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
                response.getHeaders().add("Access-Control-Allow-Headers", "Content-Type, Authorization, X-API-Key, X-Request-ID");
                response.getHeaders().add("Access-Control-Max-Age", "3600");
            }
        }));
    }

    private boolean isAllowedOrigin(String origin) {
        // TODO: Load from configuration
        return origin.equals("http://localhost:3000") ||
               origin.equals("https://mayabhedak.com") ||
               origin.equals("https://www.mayabhedak.com");
    }

    @Override
    public int getOrder() {
        return 3; // Run after rate limiting (order 2)
    }
}
