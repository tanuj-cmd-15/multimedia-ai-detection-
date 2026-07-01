package com.mayabhedak.trial.repository;

import com.mayabhedak.trial.model.Subscription;
import com.mayabhedak.trial.model.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    
    Optional<Subscription> findByUserIdAndStatus(Long userId, SubscriptionStatus status);
    
    List<Subscription> findByUserId(Long userId);
    
    @Query("SELECT s FROM Subscription s WHERE s.status = 'ACTIVE' AND s.expiryDate BETWEEN :startDate AND :endDate")
    List<Subscription> findExpiringBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT s FROM Subscription s WHERE s.status = 'ACTIVE' AND s.expiryDate < :date")
    List<Subscription> findExpiredSubscriptions(LocalDate date);
    
    boolean existsByUserIdAndStatus(Long userId, SubscriptionStatus status);
}
