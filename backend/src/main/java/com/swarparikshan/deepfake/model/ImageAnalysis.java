package com.swarparikshan.deepfake.model;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "image_analyses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageAnalysis {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String filename;
    
    @Column(nullable = false)
    private String prediction;
    
    @Column(nullable = false)
    private Double confidence;
    
    @Column(nullable = false)
    private Double realScore;
    
    @Column(nullable = false)
    private Double fakeScore;
    
    private Integer width;
    
    private Integer height;
    
    private String format;
    
    private String modelArchitecture;
    
    private String modelInputSize;
    
    private Integer modelNumClasses;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime analyzedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(columnDefinition = "TEXT")
    private String heatmap; // Base64 encoded Grad-CAM heatmap
    
    @PrePersist
    protected void onCreate() {
        analyzedAt = LocalDateTime.now();
    }
}
