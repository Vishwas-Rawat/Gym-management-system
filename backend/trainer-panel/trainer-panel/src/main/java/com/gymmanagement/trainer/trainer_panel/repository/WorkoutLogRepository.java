package com.gymmanagement.trainer.trainer_panel.repository;

import com.gymmanagement.commonservices.entity.WorkoutLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface WorkoutLogRepository extends JpaRepository<WorkoutLog, Long> {
    List<WorkoutLog> findByMemberIdAndDate(Integer memberId, LocalDate date);

    List<WorkoutLog> findByMemberIdAndDateBetween(Integer memberId, LocalDate start, LocalDate end);
}
