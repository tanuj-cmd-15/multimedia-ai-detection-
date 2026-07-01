package com.mayabhedak.trial.scheduled;

import com.mayabhedak.trial.model.Subscription;
import com.mayabhedak.trial.service.TrialService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class TrialExpiryChecker {
    
    private final TrialService trialService;
    
    /**
     * Check for expiring trials daily at 9 AM UTC
     */
    @Scheduled(cron = "0 0 9 * * *")
    public void checkExpiringTrials() {
        log.info("Starting trial expiry check...");
        
        // Check trials expiring in 3 days
        List<Subscription> expiring3Days = trialService.getExpiringSubscriptions(3);
        log.info("Found {} trials expiring in 3 days", expiring3Days.size());
        // TODO: Send notifications via notification-service
        
        // Check trials expiring in 1 day
        List<Subscription> expiring1Day = trialService.getExpiringSubscriptions(1);
        log.info("Found {} trials expiring in 1 day", expiring1Day.size());
        // TODO: Send notifications via notification-service
        
        // Mark expired subscriptions
        int markedExpired = trialService.markExpiredSubscriptions();
        log.info("Marked {} subscriptions as expired", markedExpired);
        
        log.info("Trial expiry check completed");
    }
}
