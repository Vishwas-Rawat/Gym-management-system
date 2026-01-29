package com.gymmanagement.trainer.trainer_panel.repository;

import com.gymmanagement.commonservices.entity.MemberWorkoutLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MemberWorkoutLogRepository extends JpaRepository<MemberWorkoutLog, Long> {
    List<MemberWorkoutLog> findByMemberIdAndDate(Integer memberId, LocalDate date);
}
