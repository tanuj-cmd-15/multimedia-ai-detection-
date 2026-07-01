package com.mayabhedak.auth.repository;

import com.mayabhedak.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByMobileNumber(String mobileNumber);
    
    Optional<User> findByGoogleSub(String googleSub);
    
    boolean existsByEmail(String email);
    
    boolean existsByMobileNumber(String mobileNumber);
    
    boolean existsByGoogleSub(String googleSub);
}
