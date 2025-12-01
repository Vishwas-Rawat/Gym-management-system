package com.gymmanagement.exercise.exercise_management.repository;

import com.gymmanagement.commonservices.entity.WorkoutPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkoutPlanRepository extends JpaRepository<WorkoutPlan, Integer> {

    // CORRECT — uses memberId (Integer), not Member object
    Optional<WorkoutPlan> findFirstByMemberIdOrderByCreatedAtDesc(Integer memberId);

    // Optional: get all plans for a member
    List<WorkoutPlan> findByMemberIdOrderByCreatedAtDesc(Integer memberId);
}