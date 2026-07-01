package com.mayabhedak.trial.dto;

import com.mayabhedak.trial.model.PlanType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanFeatures {
    
    private Integer durationDays;
    private Integer audioDetections;
    private Integer imageDetections;
    private Integer rateLimit;
    private Boolean bulkUpload;
    private Boolean apiAccess;
    private Boolean prioritySupport;
    private Integer priceMonthly;
    
    public static PlanFeatures fromPlanType(PlanType planType) {
        switch (planType) {
            case FREE_TRIAL:
                return PlanFeatures.builder()
                        .durationDays(14)
                        .audioDetections(50)
                        .imageDetections(50)
                        .rateLimit(10)
                        .bulkUpload(false)
                        .apiAccess(false)
                        .prioritySupport(false)
                        .priceMonthly(0)
                        .build();
            case PRO:
                return PlanFeatures.builder()
                        .durationDays(30)
                        .audioDetections(1000)
                        .imageDetections(1000)
                        .rateLimit(100)
                        .bulkUpload(true)
                        .apiAccess(true)
                        .prioritySupport(false)
                        .priceMonthly(999)
                        .build();
            case ENTERPRISE:
                return PlanFeatures.builder()
                        .durationDays(-1) // custom
                        .audioDetections(-1) // unlimited
                        .imageDetections(-1) // unlimited
                        .rateLimit(1000)
                        .bulkUpload(true)
                        .apiAccess(true)
                        .prioritySupport(true)
                        .priceMonthly(null) // custom pricing
                        .build();
            default:
                throw new IllegalArgumentException("Unknown plan type: " + planType);
        }
    }
}
