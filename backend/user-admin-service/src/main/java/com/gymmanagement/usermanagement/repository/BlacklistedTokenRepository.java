package com.gymmanagement.usermanagement.repository;

import com.gymmanagement.commonservices.entity.BlacklistedToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface BlacklistedTokenRepository extends JpaRepository<BlacklistedToken, Long> {

    boolean existsByToken(String token);

    Optional<BlacklistedToken> findByToken(String token);

    // Optional: cleanup old tokens
    void deleteAllByExpiresAtBefore(LocalDateTime dateTime);
}