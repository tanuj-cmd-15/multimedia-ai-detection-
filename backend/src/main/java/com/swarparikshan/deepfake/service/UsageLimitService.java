package com.swarparikshan.deepfake.service;

import com.swarparikshan.deepfake.model.UsageLimit;
import com.swarparikshan.deepfake.repository.UsageLimitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UsageLimitService {
    
    @Autowired
    private UsageLimitRepository usageLimitRepository;
    
    public boolean checkAndIncrementUsage(String identifier, String identifierType) {
        Optional<UsageLimit> limitOpt = usageLimitRepository.findByIdentifier(identifier);
        
        if (limitOpt.isPresent()) {
            UsageLimit limit = limitOpt.get();
            if (limit.getUsageCount() >= limit.getMaxLimit()) {
                return false; // Limit exceeded
            }
            limit.setUsageCount(limit.getUsageCount() + 1);
            limit.setLastUsedAt(LocalDateTime.now());
            usageLimitRepository.save(limit);
            return true;
        } else {
            // First use
            UsageLimit newLimit = new UsageLimit();
            newLimit.setIdentifier(identifier);
            newLimit.setIdentifierType(identifierType);
            newLimit.setUsageCount(1);
            newLimit.setMaxLimit(3);
            newLimit.setFirstUsedAt(LocalDateTime.now());
            newLimit.setLastUsedAt(LocalDateTime.now());
            usageLimitRepository.save(newLimit);
            return true;
        }
    }
    
    public int getRemainingUsage(String identifier) {
        Optional<UsageLimit> limitOpt = usageLimitRepository.findByIdentifier(identifier);
        if (limitOpt.isPresent()) {
            UsageLimit limit = limitOpt.get();
            return Math.max(0, limit.getMaxLimit() - limit.getUsageCount());
        }
        return 3; // Default limit for new users
    }
}
