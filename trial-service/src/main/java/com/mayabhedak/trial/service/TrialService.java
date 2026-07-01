package com.mayabhedak.trial.service;

import com.mayabhedak.trial.dto.*;
import com.mayabhedak.trial.model.*;
import com.mayabhedak.trial.repository.SubscriptionRepository;
import com.mayabhedak.trial.repository.UsageTrackingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TrialService {
    
    private final SubscriptionRepository subscriptionRepository;
    private final UsageTrackingRepository usageTrackingRepository;
    
    @Value("${trial.audio-limit}")
    private int trialAudioLimit;
    
    @Value("${trial.image-limit}")
    private int trialImageLimit;
    
    @Value("${trial.duration-days}")
    private int trialDurationDays;
    
    /**
     * Initialize free trial for new user
     */
    @Transactional
    public PlanDetails initializeTrial(Long userId) {
        log.info("Initializing trial for user: {}", userId);
        
        // Check if user already has a subscription
        if (subscriptionRepository.existsByUserIdAndStatus(userId, SubscriptionStatus.ACTIVE)) {
            log.warn("User {} already has an active subscription", userId);
            return getCurrentPlan(userId);
        }
        
        // Create free trial subscription
        LocalDate startDate = LocalDate.now();
        LocalDate expiryDate = startDate.plusDays(trialDurationDays);
        
        Subscription subscription = Subscription.builder()
                .userId(userId)
                .planType(PlanType.FREE_TRIAL)
                .status(SubscriptionStatus.ACTIVE)
                .startDate(startDate)
                .expiryDate(expiryDate)
                .audioLimit(trialAudioLimit)
                .imageLimit(trialImageLimit)
                .trialRequestsUsed(0)
                .build();
        
        subscription = subscriptionRepository.save(subscription);
        
        // Initialize usage tracking for current month
        LocalDate currentMonth = LocalDate.now().withDayOfMonth(1);
        
        UsageTracking audioUsage = UsageTracking.builder()
                .userId(userId)
                .detectionType(DetectionType.AUDIO)
                .count(0)
                .trackingMonth(currentMonth)
                .build();
        
        UsageTracking imageUsage = UsageTracking.builder()
                .userId(userId)
                .detectionType(DetectionType.IMAGE)
                .count(0)
                .trackingMonth(currentMonth)
                .build();
        
        usageTrackingRepository.save(audioUsage);
        usageTrackingRepository.save(imageUsage);
        
        log.info("Trial initialized successfully for user: {}", userId);
        
        return PlanDetails.fromSubscription(subscription);
    }
    
    /**
     * Get user's current plan
     */
    public PlanDetails getCurrentPlan(Long userId) {
        log.debug("Getting current plan for user: {}", userId);
        
        Subscription subscription = subscriptionRepository
                .findByUserIdAndStatus(userId, SubscriptionStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("No active subscription found for user: " + userId));
        
        // Check if subscription is expired
        if (subscription.isExpired()) {
            subscription.setStatus(SubscriptionStatus.EXPIRED);
            subscriptionRepository.save(subscription);
            throw new RuntimeException("Subscription expired for user: " + userId);
        }
        
        return PlanDetails.fromSubscription(subscription);
    }
    
    /**
     * Get usage statistics
     */
    public UsageStats getUsageStats(Long userId) {
        log.debug("Getting usage stats for user: {}", userId);
        
        Subscription subscription = subscriptionRepository
                .findByUserIdAndStatus(userId, SubscriptionStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("No active subscription found"));
        
        LocalDate currentMonth = LocalDate.now().withDayOfMonth(1);
        
        UsageTracking audioUsage = usageTrackingRepository
                .findByUserIdAndDetectionTypeAndTrackingMonth(userId, DetectionType.AUDIO, currentMonth)
                .orElse(UsageTracking.builder().count(0).build());
        
        UsageTracking imageUsage = usageTrackingRepository
                .findByUserIdAndDetectionTypeAndTrackingMonth(userId, DetectionType.IMAGE, currentMonth)
                .orElse(UsageTracking.builder().count(0).build());
        
        int audioUsed = audioUsage.getCount();
        int imageUsed = imageUsage.getCount();
        int totalUsed = audioUsed + imageUsed;
        int totalLimit = subscription.getTotalLimit();
        
        int audioRemaining = Math.max(0, subscription.getAudioLimit() - audioUsed);
        int imageRemaining = Math.max(0, subscription.getImageLimit() - imageUsed);
        
        double usagePercentage = totalLimit > 0 ? (double) totalUsed / totalLimit * 100 : 0;
        
        LocalDate resetDate = LocalDate.now().with(TemporalAdjusters.firstDayOfNextMonth());
        
        return UsageStats.builder()
                .audioUsedThisMonth(audioUsed)
                .imageUsedThisMonth(imageUsed)
                .audioRemainingThisMonth(audioRemaining)
                .imageRemainingThisMonth(imageRemaining)
                .totalUsed(totalUsed)
                .totalLimit(totalLimit)
                .usagePercentage(usagePercentage)
                .resetDate(resetDate)
                .build();
    }
    
    /**
     * Check if user can perform detection
     */
    @Transactional(readOnly = true)
    public QuotaCheckResponse checkQuota(Long userId, DetectionType detectionType) {
        log.debug("Checking quota for user: {}, type: {}", userId, detectionType);
        
        try {
            Subscription subscription = subscriptionRepository
                    .findByUserIdAndStatus(userId, SubscriptionStatus.ACTIVE)
                    .orElseThrow(() -> new RuntimeException("No active subscription"));
            
            if (subscription.isExpired()) {
                return QuotaCheckResponse.builder()
                        .canDetect(false)
                        .remaining(0)
                        .message("Trial expired. Please upgrade to continue.")
                        .planType(subscription.getPlanType().name())
                        .build();
            }
            
            LocalDate currentMonth = LocalDate.now().withDayOfMonth(1);
            UsageTracking usage = usageTrackingRepository
                    .findByUserIdAndDetectionTypeAndTrackingMonth(userId, detectionType, currentMonth)
                    .orElse(UsageTracking.builder().count(0).build());
            
            int limit = detectionType == DetectionType.AUDIO ? 
                    subscription.getAudioLimit() : subscription.getImageLimit();
            int used = usage.getCount();
            int remaining = Math.max(0, limit - used);
            
            boolean canDetect = remaining > 0 || limit == -1; // -1 means unlimited
            
            return QuotaCheckResponse.builder()
                    .canDetect(canDetect)
                    .remaining(remaining)
                    .message(canDetect ? "Quota available" : "Quota exhausted. Please upgrade.")
                    .planType(subscription.getPlanType().name())
                    .build();
            
        } catch (Exception e) {
            log.error("Error checking quota for user: {}", userId, e);
            return QuotaCheckResponse.builder()
                    .canDetect(false)
                    .remaining(0)
                    .message("Error checking quota: " + e.getMessage())
                    .planType("UNKNOWN")
                    .build();
        }
    }
    
    /**
     * Increment usage count
     */
    @Transactional
    public void incrementUsage(Long userId, DetectionType detectionType) {
        log.debug("Incrementing usage for user: {}, type: {}", userId, detectionType);
        
        LocalDate currentMonth = LocalDate.now().withDayOfMonth(1);
        
        UsageTracking usage = usageTrackingRepository
                .findByUserIdAndDetectionTypeAndTrackingMonth(userId, detectionType, currentMonth)
                .orElseGet(() -> UsageTracking.builder()
                        .userId(userId)
                        .detectionType(detectionType)
                        .count(0)
                        .trackingMonth(currentMonth)
                        .build());
        
        usage.incrementCount();
        usageTrackingRepository.save(usage);
        
        // Update subscription trial_requests_used
        Subscription subscription = subscriptionRepository
                .findByUserIdAndStatus(userId, SubscriptionStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("No active subscription"));
        
        subscription.setTrialRequestsUsed(subscription.getTrialRequestsUsed() + 1);
        subscriptionRepository.save(subscription);
        
        log.info("Usage incremented for user: {}, new count: {}", userId, usage.getCount());
    }
    
    /**
     * Get subscriptions expiring soon
     */
    public List<Subscription> getExpiringSubscriptions(int daysAhead) {
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(daysAhead);
        return subscriptionRepository.findExpiringBetween(startDate, endDate);
    }
    
    /**
     * Mark expired subscriptions
     */
    @Transactional
    public int markExpiredSubscriptions() {
        List<Subscription> expired = subscriptionRepository.findExpiredSubscriptions(LocalDate.now());
        
        for (Subscription subscription : expired) {
            subscription.setStatus(SubscriptionStatus.EXPIRED);
            subscriptionRepository.save(subscription);
        }
        
        log.info("Marked {} subscriptions as expired", expired.size());
        return expired.size();
    }
}
