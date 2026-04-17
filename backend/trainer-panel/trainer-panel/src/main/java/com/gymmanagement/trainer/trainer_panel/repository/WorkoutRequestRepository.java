package com.gymmanagement.trainer.trainer_panel.repository;

import com.gymmanagement.commonservices.entity.WorkoutRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface WorkoutRequestRepository extends JpaRepository<WorkoutRequest, Integer> {
    List<WorkoutRequest> findByTrainerIdOrderByCreatedAtDesc(Integer trainerId);

    List<WorkoutRequest> findByMemberIdOrderByCreatedAtDesc(Integer memberId);

    @Query("SELECT new com.gymmanagement.trainer.trainer_panel.dto.ChartDataDTO(CAST(w.status AS string), COUNT(w)) " +
            "FROM WorkoutRequest w WHERE w.trainerId = :trainerId " +
            "GROUP BY w.status")
    List<com.gymmanagement.trainer.trainer_panel.dto.ChartDataDTO> countByStatus(@Param("trainerId") Integer trainerId);
}
