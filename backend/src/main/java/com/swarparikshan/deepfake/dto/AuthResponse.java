package com.swarparikshan.deepfake.dto;

public class AuthResponse {
    private Long userId;
    private String email;
    private String name;
    private String userType;
    private String organizationName;
    private String apiKey;
    private Integer apiCallsRemaining;
    private String token;
    private String message;
    
    public AuthResponse() {}
    
    public AuthResponse(Long userId, String email, String name, String userType, String organizationName, 
                       String apiKey, Integer apiCallsRemaining, String token, String message) {
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.userType = userType;
        this.organizationName = organizationName;
        this.apiKey = apiKey;
        this.apiCallsRemaining = apiCallsRemaining;
        this.token = token;
        this.message = message;
    }
    
    // Getters and Setters
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getUserType() {
        return userType;
    }
    
    public void setUserType(String userType) {
        this.userType = userType;
    }
    
    public String getOrganizationName() {
        return organizationName;
    }
    
    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }
    
    public String getApiKey() {
        return apiKey;
    }
    
    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }
    
    public Integer getApiCallsRemaining() {
        return apiCallsRemaining;
    }
    
    public void setApiCallsRemaining(Integer apiCallsRemaining) {
        this.apiCallsRemaining = apiCallsRemaining;
    }
    
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
}
