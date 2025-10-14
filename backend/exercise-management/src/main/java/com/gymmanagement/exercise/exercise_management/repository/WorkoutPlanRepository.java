package com.gymmanagement.exercise.exercise_management.repository;

import com.gymmanagement.commonservices.entity.WorkoutPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WorkoutPlanRepository extends JpaRepository<WorkoutPlan, Integer> {
    Optional<WorkoutPlan> findByMember_UserId(Integer memberId);
}
