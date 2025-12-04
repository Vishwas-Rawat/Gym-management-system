package com.gymmanagement.usermanagement.repository;

import com.gymmanagement.commonservices.entity.DietLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DietLogRepository extends JpaRepository<DietLog, Long> {
}