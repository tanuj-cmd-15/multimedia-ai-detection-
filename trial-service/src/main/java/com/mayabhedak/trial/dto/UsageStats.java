package com.mayabhedak.trial.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsageStats {
    
    private Integer audioUsedThisMonth;
    private Integer imageUsedThisMonth;
    private Integer audioRemainingThisMonth;
    private Integer imageRemainingThisMonth;
    private Double usagePercentage;
    private LocalDate resetDate;
    private Integer totalUsed;
    private Integer totalLimit;
}
