package com.swarparikshan.deepfake.model;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "audio_analyses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AudioAnalysis {
    
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
    
    private Double duration;
    
    private Integer sampleRate;
    
    private Double melMean;
    
    private Double melStd;
    
    private Integer attentionPeakFrame;
    
    private Double attentionConcentration;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime analyzedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(columnDefinition = "TEXT")
    private String suspiciousRegions; // JSON string with time segments
    
    @Column(columnDefinition = "TEXT")
    private String attentionWeights; // JSON string with attention data
    
    @PrePersist
    protected void onCreate() {
        analyzedAt = LocalDateTime.now();
    }
}
