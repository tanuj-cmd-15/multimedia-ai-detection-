package com.mayabhedak.trial.dto;

import com.mayabhedak.trial.model.PlanType;
import com.mayabhedak.trial.model.Subscription;
import com.mayabhedak.trial.model.SubscriptionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanDetails {
    
    private String planType;
    private String status;
    private LocalDate startDate;
    private LocalDate expiryDate;
    private Integer audioLimit;
    private Integer imageLimit;
    private Integer trialRequestsUsed;
    private Integer trialRequestsLimit;
    private LocalDate trialExpiresAt;
    private Long daysRemaining;
    private PlanLimits limits;
    private PlanFeatures features;
    
    public static PlanDetails fromSubscription(Subscription subscription) {
        long daysRemaining = ChronoUnit.DAYS.between(LocalDate.now(), subscription.getExpiryDate());
        
        return PlanDetails.builder()
                .planType(subscription.getPlanType().name())
                .status(subscription.getStatus().name())
                .startDate(subscription.getStartDate())
                .expiryDate(subscription.getExpiryDate())
                .audioLimit(subscription.getAudioLimit())
                .imageLimit(subscription.getImageLimit())
                .trialRequestsUsed(subscription.getTrialRequestsUsed())
                .trialRequestsLimit(subscription.getTotalLimit())
                .trialExpiresAt(subscription.getExpiryDate())
                .daysRemaining(daysRemaining > 0 ? daysRemaining : 0)
                .limits(PlanLimits.fromPlanType(subscription.getPlanType()))
                .features(PlanFeatures.fromPlanType(subscription.getPlanType()))
                .build();
    }
}
