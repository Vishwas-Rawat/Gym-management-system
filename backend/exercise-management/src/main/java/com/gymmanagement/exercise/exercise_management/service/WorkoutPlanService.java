package com.gymmanagement.exercise.exercise_management.service;

import com.gymmanagement.exercise.exercise_management.dto.WorkoutPlanRequest;
import com.gymmanagement.exercise.exercise_management.dto.WorkoutPlanResponse;

import java.util.List;

public interface WorkoutPlanService {
    WorkoutPlanResponse createWorkoutPlan(WorkoutPlanRequest request);
    List<WorkoutPlanResponse> getAllPlans();
    WorkoutPlanResponse getPlanById(Integer planId);
}
