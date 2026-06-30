package com.swarparikshan.deepfake.repository;

import com.swarparikshan.deepfake.model.AudioAnalysis;
import com.swarparikshan.deepfake.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AudioAnalysisRepository extends JpaRepository<AudioAnalysis, Long> {
    
    List<AudioAnalysis> findByPrediction(String prediction);
    
    List<AudioAnalysis> findByAnalyzedAtBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT COUNT(a) FROM AudioAnalysis a WHERE a.prediction = ?1")
    Long countByPrediction(String prediction);
    
    @Query("SELECT a FROM AudioAnalysis a ORDER BY a.analyzedAt DESC")
    List<AudioAnalysis> findRecentAnalyses();
    
    List<AudioAnalysis> findByUserOrderByAnalyzedAtDesc(User user);
    
    List<AudioAnalysis> findTop10ByUserOrderByAnalyzedAtDesc(User user);
    
    List<AudioAnalysis> findTop10ByOrderByAnalyzedAtDesc();
}
