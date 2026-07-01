package com.mayabhedak.trial.repository;

import com.mayabhedak.trial.model.DetectionType;
import com.mayabhedak.trial.model.UsageTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UsageTrackingRepository extends JpaRepository<UsageTracking, Long> {
    
    Optional<UsageTracking> findByUserIdAndDetectionTypeAndTrackingMonth(
        Long userId, DetectionType detectionType, LocalDate trackingMonth);
    
    List<UsageTracking> findByUserIdAndTrackingMonth(Long userId, LocalDate trackingMonth);
    
    @Modifying
    @Query("UPDATE UsageTracking u SET u.count = 0 WHERE u.trackingMonth < :month")
    int resetUsageForMonth(LocalDate month);
}
