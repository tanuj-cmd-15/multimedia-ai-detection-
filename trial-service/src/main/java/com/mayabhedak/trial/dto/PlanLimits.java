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
public class PlanLimits {
    
    private Integer audioDetectionsPerMonth;
    private Integer imageDetectionsPerMonth;
    private Integer apiCallsPerMinute;
    private Boolean bulkUpload;
    private Boolean apiAccess;
    private Boolean prioritySupport;
    
    public static PlanLimits fromPlanType(PlanType planType) {
        switch (planType) {
            case FREE_TRIAL:
                return PlanLimits.builder()
                        .audioDetectionsPerMonth(50)
                        .imageDetectionsPerMonth(50)
                        .apiCallsPerMinute(10)
                        .bulkUpload(false)
                        .apiAccess(false)
                        .prioritySupport(false)
                        .build();
            case PRO:
                return PlanLimits.builder()
                        .audioDetectionsPerMonth(1000)
                        .imageDetectionsPerMonth(1000)
                        .apiCallsPerMinute(100)
                        .bulkUpload(true)
                        .apiAccess(true)
                        .prioritySupport(false)
                        .build();
            case ENTERPRISE:
                return PlanLimits.builder()
                        .audioDetectionsPerMonth(-1) // unlimited
                        .imageDetectionsPerMonth(-1) // unlimited
                        .apiCallsPerMinute(1000)
                        .bulkUpload(true)
                        .apiAccess(true)
                        .prioritySupport(true)
                        .build();
            default:
                throw new IllegalArgumentException("Unknown plan type: " + planType);
        }
    }
}
