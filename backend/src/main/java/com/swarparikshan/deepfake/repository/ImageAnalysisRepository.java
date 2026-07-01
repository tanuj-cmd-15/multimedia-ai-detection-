package com.swarparikshan.deepfake.repository;

import com.swarparikshan.deepfake.model.ImageAnalysis;
import com.swarparikshan.deepfake.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageAnalysisRepository extends JpaRepository<ImageAnalysis, Long> {
    List<ImageAnalysis> findByUserOrderByAnalyzedAtDesc(User user);
    List<ImageAnalysis> findTop10ByOrderByAnalyzedAtDesc();
    List<ImageAnalysis> findTop10ByUserOrderByAnalyzedAtDesc(User user);
}
