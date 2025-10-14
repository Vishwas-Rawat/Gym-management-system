package com.gymmanagement.exercise.exercise_management.repository;

import com.gymmanagement.commonservices.entity.WorkoutPlanItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkoutPlanItemRepository extends JpaRepository<WorkoutPlanItem, Integer> {
}
