package com.gymmanagement.trainer.trainer_panel.service;

import com.gymmanagement.trainer.trainer_panel.dto.AssignDietRequest;
import com.gymmanagement.trainer.trainer_panel.dto.DietPlanResponse;

public interface DietService {

    DietPlanResponse assignDietPlan(Integer trainerId, AssignDietRequest req);

    DietPlanResponse getLatestDietForMember(Integer memberId);

    void logDiet(Integer memberId, com.gymmanagement.trainer.trainer_panel.dto.DietLogRequest req);

    java.util.List<com.gymmanagement.commonservices.entity.DietLog> getTodayLogs(Integer memberId);

    java.util.List<com.gymmanagement.commonservices.entity.DietLog> getHistory(Integer memberId);
}
