package com.swarparikshan.deepfake.service;

import com.swarparikshan.deepfake.dto.ImagePredictionResponse;
import com.swarparikshan.deepfake.model.ImageAnalysis;
import com.swarparikshan.deepfake.model.User;
import com.swarparikshan.deepfake.repository.ImageAnalysisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ImageAnalysisService {
    
    @Autowired
    private ImageAnalysisRepository imageAnalysisRepository;
    
    public ImageAnalysis saveAnalysis(Map<String, Object> predictionResult, String filename, User user) {
        ImageAnalysis analysis = new ImageAnalysis();
        analysis.setFilename(filename);
        analysis.setPrediction((String) predictionResult.get("prediction"));
        analysis.setConfidence(((Number) predictionResult.get("confidence")).doubleValue());
        
        // Extract scores
        Map<String, Object> scores = (Map<String, Object>) predictionResult.get("scores");
        analysis.setRealScore(((Number) scores.get("real")).doubleValue());
        analysis.setFakeScore(((Number) scores.get("fake")).doubleValue());
        
        // Extract image info
        Map<String, Object> imageInfo = (Map<String, Object>) predictionResult.get("image_info");
        analysis.setWidth(((Number) imageInfo.get("width")).intValue());
        analysis.setHeight(((Number) imageInfo.get("height")).intValue());
        analysis.setFormat((String) imageInfo.get("format"));
        
        // Extract model info
        Map<String, Object> modelInfo = (Map<String, Object>) predictionResult.get("model_info");
        analysis.setModelArchitecture((String) modelInfo.get("architecture"));
        analysis.setModelInputSize((String) modelInfo.get("input_size"));
        analysis.setModelNumClasses(((Number) modelInfo.get("num_classes")).intValue());
        
        // Extract heatmap
        if (predictionResult.containsKey("heatmap")) {
            analysis.setHeatmap((String) predictionResult.get("heatmap"));
        }
        
        analysis.setUser(user);
        
        return imageAnalysisRepository.save(analysis);
    }
    
    public List<ImagePredictionResponse> getUserAnalyses(User user) {
        List<ImageAnalysis> analyses = imageAnalysisRepository.findByUserOrderByAnalyzedAtDesc(user);
        return convertToResponseList(analyses);
    }
    
    public List<ImagePredictionResponse> getAllAnalyses() {
        List<ImageAnalysis> analyses = imageAnalysisRepository.findAll();
        return convertToResponseList(analyses);
    }
    
    public List<ImagePredictionResponse> getRecentAnalyses() {
        List<ImageAnalysis> analyses = imageAnalysisRepository.findTop10ByOrderByAnalyzedAtDesc();
        return convertToResponseList(analyses);
    }
    
    public List<ImagePredictionResponse> getRecentUserAnalyses(User user) {
        List<ImageAnalysis> analyses = imageAnalysisRepository.findTop10ByUserOrderByAnalyzedAtDesc(user);
        return convertToResponseList(analyses);
    }
    
    public ImagePredictionResponse getAnalysisById(Long id) {
        ImageAnalysis analysis = imageAnalysisRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Image analysis not found"));
        return convertToResponse(analysis);
    }
    
    private List<ImagePredictionResponse> convertToResponseList(List<ImageAnalysis> analyses) {
        return analyses.stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    private ImagePredictionResponse convertToResponse(ImageAnalysis analysis) {
        ImagePredictionResponse response = new ImagePredictionResponse();
        response.setId(analysis.getId());
        response.setPrediction(analysis.getPrediction());
        response.setConfidence(analysis.getConfidence());
        response.setAnalyzedAt(analysis.getAnalyzedAt());
        
        // Set scores
        ImagePredictionResponse.Scores scores = new ImagePredictionResponse.Scores();
        scores.setReal(analysis.getRealScore());
        scores.setFake(analysis.getFakeScore());
        response.setScores(scores);
        
        // Set image info
        ImagePredictionResponse.ImageInfo imageInfo = new ImagePredictionResponse.ImageInfo();
        imageInfo.setWidth(analysis.getWidth());
        imageInfo.setHeight(analysis.getHeight());
        imageInfo.setFormat(analysis.getFormat());
        response.setImage_info(imageInfo);
        
        // Set model info
        ImagePredictionResponse.ModelInfo modelInfo = new ImagePredictionResponse.ModelInfo();
        modelInfo.setArchitecture(analysis.getModelArchitecture());
        modelInfo.setInput_size(analysis.getModelInputSize());
        modelInfo.setNum_classes(analysis.getModelNumClasses());
        response.setModel_info(modelInfo);
        
        // Set heatmap
        response.setHeatmap(analysis.getHeatmap());
        
        return response;
    }
}
