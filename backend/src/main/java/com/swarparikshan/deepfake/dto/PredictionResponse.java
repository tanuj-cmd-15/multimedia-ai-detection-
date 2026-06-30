package com.swarparikshan.deepfake.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PredictionResponse {
    private Long id;
    private String prediction;
    private Double confidence;
    private ScoreDetails scores;
    private AudioInfo audioInfo;
    private FeatureDetails features;
    private ModelInfo modelInfo;
    private String suspiciousRegions; // JSON string
    private String attentionWeights; // JSON string
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ScoreDetails {
        private Double real;
        private Double fake;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AudioInfo {
        private Double duration;
        private Integer sampleRate;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FeatureDetails {
        private Double melMean;
        private Double melStd;
        private Integer attentionPeakFrame;
        private Double attentionConcentration;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ModelInfo {
        private String architecture;
        private String validationEer;
        private String validationAccuracy;
    }
}
