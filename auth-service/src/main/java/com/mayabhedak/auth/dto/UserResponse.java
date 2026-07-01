package com.mayabhedak.auth.dto;

import com.mayabhedak.auth.model.AuthProvider;
import com.mayabhedak.auth.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    
    private Long id;
    private String email;
    private String mobileNumber;
    private String fullName;
    private String avatarUrl;
    private AuthProvider authProvider;
    private Boolean emailVerified;
    private Boolean mobileVerified;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
    
    // Factory method to convert User entity to UserResponse
    public static UserResponse fromUser(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .mobileNumber(user.getMobileNumber())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .authProvider(user.getAuthProvider())
                .emailVerified(user.getEmailVerified())
                .mobileVerified(user.getMobileVerified())
                .createdAt(user.getCreatedAt())
                .lastLoginAt(user.getLastLoginAt())
                .build();
    }
}
