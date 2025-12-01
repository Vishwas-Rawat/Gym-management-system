package com.gymmanagement.trainer.trainer_panel.repository;

import com.gymmanagement.commonservices.entity.WorkoutRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WorkoutRequestRepository extends JpaRepository<WorkoutRequest, Integer> {
    List<WorkoutRequest> findByTrainerIdOrderByCreatedAtDesc(Integer trainerId);
    List<WorkoutRequest> findByMemberIdOrderByCreatedAtDesc(Integer memberId);
}
