package com.swarparikshan.deepfake.repository;

import com.swarparikshan.deepfake.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByApiKey(String apiKey);
    boolean existsByEmail(String email);
}
