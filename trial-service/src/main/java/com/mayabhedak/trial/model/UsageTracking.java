package com.mayabhedak.trial.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "usage_tracking", 
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "detection_type", "tracking_month"}),
    indexes = @Index(name = "idx_usage_user_month", columnList = "user_id, tracking_month")
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsageTracking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "detection_type", nullable = false, length = 20)
    private DetectionType detectionType;
    
    @NotNull
    @Column(nullable = false)
    @Builder.Default
    private Integer count = 0;
    
    @NotNull
    @Column(name = "tracking_month", nullable = false)
    private LocalDate trackingMonth;
    
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
    
    @PrePersist
    @PreUpdate
    public void updateTimestamp() {
        this.lastUpdated = LocalDateTime.now();
    }
    
    public void incrementCount() {
        this.count++;
        this.lastUpdated = LocalDateTime.now();
    }
}
