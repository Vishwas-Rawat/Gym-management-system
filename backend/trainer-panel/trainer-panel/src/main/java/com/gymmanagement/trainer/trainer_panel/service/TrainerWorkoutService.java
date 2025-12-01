package com.gymmanagement.trainer.trainer_panel.service;

import com.gymmanagement.trainer.trainer_panel.dto.*;
import java.util.List;

public interface TrainerWorkoutService {

    WorkoutAssignSuccessResponse assignWorkoutPlan(Integer trainerId, AssignWorkoutRequest req);

    WorkoutPlanResponse getLatestPlanForMember(Integer memberId);

    List<ViewMemberResponse> getAssignedMembers(Long gymId, Integer trainerId);
}
