package com.gymmanagement.trainer.trainer_panel.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gymmanagement.commonservices.entity.WorkoutPlan;

import java.util.Optional;

public interface WorkoutPlanRepository extends JpaRepository<WorkoutPlan, Integer> {
    Optional<WorkoutPlan> findFirstByMemberIdOrderByCreatedAtDesc(Integer memberId);
}
