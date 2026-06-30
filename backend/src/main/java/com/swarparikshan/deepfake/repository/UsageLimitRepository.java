package com.swarparikshan.deepfake.repository;

import com.swarparikshan.deepfake.model.UsageLimit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsageLimitRepository extends JpaRepository<UsageLimit, Long> {
    Optional<UsageLimit> findByIdentifier(String identifier);
}
