// src/main/java/com/gymmanagement/exercise/exercise_management/service/TrainerWorkoutService.java
package com.gymmanagement.exercise.exercise_management.service;

import com.gymmanagement.exercise.exercise_management.dto.AssignWorkoutRequest;
import com.gymmanagement.exercise.exercise_management.dto.MemberDto;
import com.gymmanagement.exercise.exercise_management.dto.WorkoutPlanResponse;

import java.util.List;

public interface TrainerWorkoutService {
    WorkoutPlanResponse assignWorkoutPlan(Integer trainerId, AssignWorkoutRequest request);

    List<MemberDto> getMembersByTrainer(Integer trainerId);
    WorkoutPlanResponse getLatestPlanForMember(Integer memberId);
}