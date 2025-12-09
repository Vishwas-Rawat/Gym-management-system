package com.gymmanagement.trainer.trainer_panel.repository;

import com.gymmanagement.commonservices.entity.DietLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface DietLogRepository extends JpaRepository<DietLog, Long> {
    List<DietLog> findByMemberIdAndDate(Integer memberId, LocalDate date);

    List<DietLog> findByMemberIdAndDateBetween(Integer memberId, LocalDate start, LocalDate end);
}
