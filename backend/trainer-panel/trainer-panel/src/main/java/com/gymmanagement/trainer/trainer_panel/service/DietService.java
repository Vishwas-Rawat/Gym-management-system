package com.gymmanagement.trainer.trainer_panel.service;

import com.gymmanagement.trainer.trainer_panel.dto.AssignDietRequest;
import com.gymmanagement.trainer.trainer_panel.dto.DietPlanResponse;

public interface DietService {

    DietPlanResponse assignDietPlan(Integer trainerId, AssignDietRequest req);

    DietPlanResponse getLatestDietForMember(Integer memberId);
}
