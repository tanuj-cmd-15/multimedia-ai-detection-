package com.mayabhedak.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OTPResponse {
    
    private String message;
    private Integer expiresIn; // in seconds
    private String mobileNumber;
}
