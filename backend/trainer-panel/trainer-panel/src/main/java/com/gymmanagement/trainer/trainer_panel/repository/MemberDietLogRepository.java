package com.gymmanagement.trainer.trainer_panel.repository;

import com.gymmanagement.commonservices.entity.MemberDietLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MemberDietLogRepository extends JpaRepository<MemberDietLog, Long> {
    List<MemberDietLog> findByMemberIdAndDate(Integer memberId, LocalDate date);
}
