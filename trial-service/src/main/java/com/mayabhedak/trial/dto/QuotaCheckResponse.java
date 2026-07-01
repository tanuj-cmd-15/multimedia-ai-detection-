package com.mayabhedak.trial.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuotaCheckResponse {
    
    private Boolean canDetect;
    private Integer remaining;
    private String message;
    private String planType;
}
