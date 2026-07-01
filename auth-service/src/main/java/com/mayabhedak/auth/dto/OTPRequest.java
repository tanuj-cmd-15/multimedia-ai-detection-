package com.mayabhedak.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OTPRequest {
    
    @NotBlank(message = "Mobile number is required")
    @Pattern(
        regexp = "^\\+[1-9]\\d{1,14}$",
        message = "Mobile number must be in E.164 format (e.g., +919876543210)"
    )
    private String mobileNumber;
}
