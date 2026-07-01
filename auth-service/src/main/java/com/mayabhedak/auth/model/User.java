package com.mayabhedak.auth.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_users_email", columnList = "email"),
    @Index(name = "idx_users_mobile", columnList = "mobile_number"),
    @Index(name = "idx_users_google_sub", columnList = "google_sub")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Email(message = "Email must be valid")
    @Column(unique = true, length = 255)
    private String email;
    
    @Column(name = "mobile_number", unique = true, length = 20)
    private String mobileNumber;
    
    @Column(name = "password_hash", length = 255)
    private String passwordHash;
    
    @Column(name = "google_sub", unique = true, length = 255)
    private String googleSub;
    
    @NotNull(message = "Auth provider is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "auth_provider", nullable = false, length = 20)
    private AuthProvider authProvider;
    
    @NotNull(message = "Full name is required")
    @Size(min = 2, max = 255, message = "Full name must be between 2 and 255 characters")
    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;
    
    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;
    
    @Column(name = "email_verified", nullable = false)
    @Builder.Default
    private Boolean emailVerified = false;
    
    @Column(name = "mobile_verified", nullable = false)
    @Builder.Default
    private Boolean mobileVerified = false;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Validation methods
    @PrePersist
    @PreUpdate
    private void validate() {
        if (authProvider == AuthProvider.EMAIL) {
            if (email == null || passwordHash == null) {
                throw new IllegalStateException("Email and password are required for EMAIL auth provider");
            }
        } else if (authProvider == AuthProvider.GOOGLE) {
            if (googleSub == null) {
                throw new IllegalStateException("Google sub is required for GOOGLE auth provider");
            }
        } else if (authProvider == AuthProvider.MOBILE) {
            if (mobileNumber == null) {
                throw new IllegalStateException("Mobile number is required for MOBILE auth provider");
            }
        }
    }
    
    // Helper methods
    public void updateLastLogin() {
        this.lastLoginAt = LocalDateTime.now();
    }
}
