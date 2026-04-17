package com.gymmanagement.usermanagement.service;

import com.gymmanagement.commonservices.entity.Plan;
import java.util.List;

public interface PlanService {
    List<Plan> getAllPlansByGym(Long gymId);

    Plan createPlan(Plan plan);

    Plan updatePlan(Integer id, Plan plan);

    void deactivatePlan(Integer id);

    Plan getPlanById(Integer id);
}
