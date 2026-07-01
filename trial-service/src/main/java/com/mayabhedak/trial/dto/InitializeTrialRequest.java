package com.mayabhedak.trial.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InitializeTrialRequest {
    
    @NotNull(message = "User ID is required")
    private Long userId;
}
