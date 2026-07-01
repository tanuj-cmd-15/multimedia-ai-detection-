package com.swarparikshan.deepfake.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImagePredictionResponse {
    private Long id;
    private String prediction;
    private Double confidence;
    private Scores scores;
    private ImageInfo image_info;
    private ModelInfo model_info;
    private String heatmap;
    private LocalDateTime analyzedAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Scores {
        private Double real;
        private Double fake;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImageInfo {
        private Integer width;
        private Integer height;
        private String format;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ModelInfo {
        private String architecture;
        private String input_size;
        private Integer num_classes;
    }
}
