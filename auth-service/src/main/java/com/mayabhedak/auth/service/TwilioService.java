package com.mayabhedak.auth.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
@Slf4j
public class TwilioService {
    
    @Value("${twilio.account-sid}")
    private String accountSid;
    
    @Value("${twilio.auth-token}")
    private String authToken;
    
    @Value("${twilio.phone-number}")
    private String fromPhoneNumber;
    
    @PostConstruct
    public void init() {
        if (accountSid != null && authToken != null && !accountSid.isEmpty() && !authToken.isEmpty()) {
            Twilio.init(accountSid, authToken);
            log.info("Twilio initialized successfully");
        } else {
            log.warn("Twilio credentials not configured - SMS functionality will be disabled");
        }
    }
    
    /**
     * Send SMS message using Twilio
     */
    public String sendSMS(String toPhoneNumber, String messageText) {
        try {
            Message message = Message.creator(
                    new PhoneNumber(toPhoneNumber),
                    new PhoneNumber(fromPhoneNumber),
                    messageText
            ).create();
            
            log.info("SMS sent successfully to {}, SID: {}", toPhoneNumber, message.getSid());
            return message.getSid();
            
        } catch (Exception e) {
            log.error("Failed to send SMS to {}: {}", toPhoneNumber, e.getMessage(), e);
            throw new RuntimeException("Failed to send SMS: " + e.getMessage(), e);
        }
    }
    
    /**
     * Send OTP SMS with formatted message
     */
    public String sendOTP(String toPhoneNumber, String otp) {
        String message = String.format(
            "Your MayaBhedak verification code is: %s\n\nThis code will expire in 5 minutes.\n\nIf you didn't request this code, please ignore this message.",
            otp
        );
        return sendSMS(toPhoneNumber, message);
    }
    
    /**
     * Validate phone number format (E.164)
     */
    public boolean isValidPhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isEmpty()) {
            return false;
        }
        // E.164 format: +[country code][number] (e.g., +919876543210)
        return phoneNumber.matches("^\\+[1-9]\\d{1,14}$");
    }
}
