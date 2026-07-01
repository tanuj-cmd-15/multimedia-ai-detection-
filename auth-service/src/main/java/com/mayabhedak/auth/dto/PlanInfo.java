package com.mayabhedak.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanInfo {
    
    private String planType; // FREE_TRIAL, PRO, ENTERPRISE
    private Integer trialRequestsUsed;
    private Integer trialRequestsLimit;
    private LocalDate trialExpiresAt;
    private String status; // ACTIVE, EXPIRED, CANCELLED
}
