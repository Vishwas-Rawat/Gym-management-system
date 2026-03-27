package com.gymmanagement.trainer.trainer_panel.service;

import com.gymmanagement.trainer.trainer_panel.dto.*;
import java.util.List;

public interface TrainerWorkoutService {

    WorkoutAssignSuccessResponse assignWorkoutPlan(Integer trainerId, AssignWorkoutRequest req);

    WorkoutPlanResponse getLatestPlanForMember(Integer memberId);

    List<ViewMemberResponse> getAssignedMembers(Long gymId, Integer trainerId);

    void logWorkout(Integer memberId, WorkoutLogRequest req);

    List<com.gymmanagement.commonservices.entity.WorkoutLog> getTodayWorkoutLogs(Integer memberId);

    // New methods
    void deleteWorkoutLog(Integer memberId, Long logId);

    void updateWorkoutLog(Integer memberId, Long logId, WorkoutLogRequest req);
}
