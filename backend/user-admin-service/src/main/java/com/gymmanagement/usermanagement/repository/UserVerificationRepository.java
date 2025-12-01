package com.gymmanagement.usermanagement.repository;

import com.gymmanagement.commonservices.entity.UserVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.Optional;

public interface UserVerificationRepository extends JpaRepository<UserVerification, Integer> {

    Optional<UserVerification> findTopByUser_UserIdOrderByCreatedAtDesc(Integer userId);

    Optional<UserVerification> findByUser_UserIdAndOtpCodeAndIsUsedFalseAndExpiresAtAfter(
            Integer userId, String otpCode, LocalDateTime now);
}