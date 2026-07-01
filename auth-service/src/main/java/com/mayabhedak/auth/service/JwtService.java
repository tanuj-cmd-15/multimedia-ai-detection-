package com.mayabhedak.auth.service;

import com.mayabhedak.auth.model.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class JwtService {
    
    @Value("${jwt.secret.private-key}")
    private Resource privateKeyResource;
    
    @Value("${jwt.secret.public-key}")
    private Resource publicKeyResource;
    
    @Value("${jwt.expiration.access-token}")
    private long accessTokenExpiration;
    
    @Value("${jwt.expiration.refresh-token}")
    private long refreshTokenExpiration;
    
    private PrivateKey privateKey;
    private PublicKey publicKey;
    
    @PostConstruct
    public void init() throws Exception {
        this.privateKey = loadPrivateKey();
        this.publicKey = loadPublicKey();
        log.info("JWT keys loaded successfully");
    }
    
    /**
     * Generate access token (15 minutes)
     */
    public String generateAccessToken(User user, String planType) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("email", user.getEmail());
        claims.put("plan", planType);
        claims.put("roles", new String[]{"USER"});
        claims.put("type", "access");
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getId().toString())
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact();
    }
    
    /**
     * Generate refresh token (7 days)
     */
    public String generateRefreshToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("type", "refresh");
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(user.getId().toString())
                .setId(UUID.randomUUID().toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact();
    }
    
    /**
     * Validate token signature and expiration
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(publicKey)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("JWT token expired: {}", e.getMessage());
            return false;
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
            return false;
        } catch (MalformedJwtException e) {
            log.error("JWT token is malformed: {}", e.getMessage());
            return false;
        } catch (SignatureException e) {
            log.error("JWT signature validation failed: {}", e.getMessage());
            return false;
        } catch (IllegalArgumentException e) {
            log.error("JWT token compact of handler are invalid: {}", e.getMessage());
            return false;
        }
    }
    
    /**
     * Extract all claims from token
     */
    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(publicKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    /**
     * Extract user ID from token
     */
    public Long extractUserId(String token) {
        Claims claims = extractClaims(token);
        return claims.get("userId", Long.class);
    }
    
    /**
     * Extract token ID (jti claim) for blacklisting
     */
    public String extractTokenId(String token) {
        Claims claims = extractClaims(token);
        return claims.getId();
    }
    
    /**
     * Check if token is expired
     */
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = extractClaims(token);
            return claims.getExpiration().before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        }
    }
    
    /**
     * Get token expiration time
     */
    public Date getExpirationDate(String token) {
        Claims claims = extractClaims(token);
        return claims.getExpiration();
    }
    
    /**
     * Load private key from file
     */
    private PrivateKey loadPrivateKey() throws Exception {
        try {
            byte[] keyBytes = Files.readAllBytes(privateKeyResource.getFile().toPath());
            String privateKeyPEM = new String(keyBytes)
                    .replace("-----BEGIN PRIVATE KEY-----", "")
                    .replace("-----END PRIVATE KEY-----", "")
                    .replaceAll("\\s", "");
            
            byte[] decoded = Base64.getDecoder().decode(privateKeyPEM);
            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(decoded);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            return keyFactory.generatePrivate(keySpec);
        } catch (IOException e) {
            log.error("Failed to load private key", e);
            throw new RuntimeException("Could not load private key", e);
        }
    }
    
    /**
     * Load public key from file
     */
    private PublicKey loadPublicKey() throws Exception {
        try {
            byte[] keyBytes = Files.readAllBytes(publicKeyResource.getFile().toPath());
            String publicKeyPEM = new String(keyBytes)
                    .replace("-----BEGIN PUBLIC KEY-----", "")
                    .replace("-----END PUBLIC KEY-----", "")
                    .replaceAll("\\s", "");
            
            byte[] decoded = Base64.getDecoder().decode(publicKeyPEM);
            X509EncodedKeySpec keySpec = new X509EncodedKeySpec(decoded);
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            return keyFactory.generatePublic(keySpec);
        } catch (IOException e) {
            log.error("Failed to load public key", e);
            throw new RuntimeException("Could not load public key", e);
        }
    }
    
    /**
     * Get access token expiration in seconds
     */
    public long getAccessTokenExpirationInSeconds() {
        return accessTokenExpiration / 1000;
    }
}
