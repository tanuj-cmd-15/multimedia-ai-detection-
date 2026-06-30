package com.swarparikshan.deepfake.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usage_limits")
public class UsageLimit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String identifier; // email or machine ID
    
    @Column(nullable = false)
    private String identifierType; // EMAIL, MACHINE_ID
    
    @Column(nullable = false)
    private Integer usageCount = 0;
    
    @Column(nullable = false)
    private Integer maxLimit = 3;
    
    @Column
    private LocalDateTime firstUsedAt = LocalDateTime.now();
    
    @Column
    private LocalDateTime lastUsedAt = LocalDateTime.now();
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getIdentifier() {
        return identifier;
    }
    
    public void setIdentifier(String identifier) {
        this.identifier = identifier;
    }
    
    public String getIdentifierType() {
        return identifierType;
    }
    
    public void setIdentifierType(String identifierType) {
        this.identifierType = identifierType;
    }
    
    public Integer getUsageCount() {
        return usageCount;
    }
    
    public void setUsageCount(Integer usageCount) {
        this.usageCount = usageCount;
    }
    
    public Integer getMaxLimit() {
        return maxLimit;
    }
    
    public void setMaxLimit(Integer maxLimit) {
        this.maxLimit = maxLimit;
    }
    
    public LocalDateTime getFirstUsedAt() {
        return firstUsedAt;
    }
    
    public void setFirstUsedAt(LocalDateTime firstUsedAt) {
        this.firstUsedAt = firstUsedAt;
    }
    
    public LocalDateTime getLastUsedAt() {
        return lastUsedAt;
    }
    
    public void setLastUsedAt(LocalDateTime lastUsedAt) {
        this.lastUsedAt = lastUsedAt;
    }
}
