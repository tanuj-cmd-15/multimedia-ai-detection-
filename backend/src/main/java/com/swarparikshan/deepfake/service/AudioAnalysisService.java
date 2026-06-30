package com.swarparikshan.deepfake.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.swarparikshan.deepfake.dto.PredictionResponse;
import com.swarparikshan.deepfake.model.AudioAnalysis;
import com.swarparikshan.deepfake.model.User;
import com.swarparikshan.deepfake.repository.AudioAnalysisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AudioAnalysisService {
    
    @Autowired
    private PythonModelService pythonModelService;
    
    @Autowired
    private AudioAnalysisRepository audioAnalysisRepository;
    
    public PredictionResponse analyzeAudio(MultipartFile file, User user) throws IOException {
        // Get prediction from Python service
        JsonNode result = pythonModelService.predict(file);
        
        // Save to database
        AudioAnalysis analysis = new AudioAnalysis();
        analysis.setFilename(file.getOriginalFilename());
        analysis.setPrediction(result.get("prediction").asText());
        analysis.setConfidence(result.get("confidence").asDouble());
        analysis.setRealScore(result.get("scores").get("real").asDouble());
        analysis.setFakeScore(result.get("scores").get("fake").asDouble());
        analysis.setDuration(result.get("audio_info").get("duration").asDouble());
        analysis.setSampleRate(result.get("audio_info").get("sample_rate").asInt());
        analysis.setMelMean(result.get("features").get("mel_mean").asDouble());
        analysis.setMelStd(result.get("features").get("mel_std").asDouble());
        analysis.setAttentionPeakFrame(result.get("features").get("attention_peak_frame").asInt());
        analysis.setAttentionConcentration(result.get("features").get("attention_concentration").asDouble());
        
        // Store suspicious regions and attention weights as JSON strings
        if (result.has("suspicious_regions")) {
            analysis.setSuspiciousRegions(result.get("suspicious_regions").toString());
        }
        if (result.has("attention_weights")) {
            analysis.setAttentionWeights(result.get("attention_weights").toString());
        }
        
        // Associate with user if logged in
        if (user != null) {
            analysis.setUser(user);
        }
        
        analysis = audioAnalysisRepository.save(analysis);
        
        // Convert to response DTO
        return convertToResponse(analysis, result);
    }
    
    public List<PredictionResponse> getAllAnalyses() {
        return audioAnalysisRepository.findAll().stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    public List<PredictionResponse> getRecentAnalyses() {
        return audioAnalysisRepository.findRecentAnalyses().stream()
            .limit(10)
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    public List<PredictionResponse> getUserAnalyses(User user) {
        return audioAnalysisRepository.findByUserOrderByAnalyzedAtDesc(user).stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    public List<PredictionResponse> getRecentUserAnalyses(User user) {
        return audioAnalysisRepository.findTop10ByUserOrderByAnalyzedAtDesc(user).stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    public PredictionResponse getAnalysisById(Long id) {
        AudioAnalysis analysis = audioAnalysisRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Analysis not found"));
        return convertToResponse(analysis);
    }
    
    private PredictionResponse convertToResponse(AudioAnalysis analysis) {
        PredictionResponse response = new PredictionResponse();
        response.setId(analysis.getId());
        response.setPrediction(analysis.getPrediction());
        response.setConfidence(analysis.getConfidence());
        
        PredictionResponse.ScoreDetails scores = new PredictionResponse.ScoreDetails();
        scores.setReal(analysis.getRealScore());
        scores.setFake(analysis.getFakeScore());
        response.setScores(scores);
        
        PredictionResponse.AudioInfo audioInfo = new PredictionResponse.AudioInfo();
        audioInfo.setDuration(analysis.getDuration());
        audioInfo.setSampleRate(analysis.getSampleRate());
        response.setAudioInfo(audioInfo);
        
        PredictionResponse.FeatureDetails features = new PredictionResponse.FeatureDetails();
        features.setMelMean(analysis.getMelMean());
        features.setMelStd(analysis.getMelStd());
        features.setAttentionPeakFrame(analysis.getAttentionPeakFrame());
        features.setAttentionConcentration(analysis.getAttentionConcentration());
        response.setFeatures(features);
        
        // Add suspicious regions and attention weights if available
        response.setSuspiciousRegions(analysis.getSuspiciousRegions());
        response.setAttentionWeights(analysis.getAttentionWeights());
        
        return response;
    }
    
    private PredictionResponse convertToResponse(AudioAnalysis analysis, JsonNode result) {
        PredictionResponse response = convertToResponse(analysis);
        
        PredictionResponse.ModelInfo modelInfo = new PredictionResponse.ModelInfo();
        modelInfo.setArchitecture(result.get("model_info").get("architecture").asText());
        modelInfo.setValidationEer(result.get("model_info").get("validation_eer").asText());
        modelInfo.setValidationAccuracy(result.get("model_info").get("validation_accuracy").asText());
        response.setModelInfo(modelInfo);
        
        return response;
    }
}
