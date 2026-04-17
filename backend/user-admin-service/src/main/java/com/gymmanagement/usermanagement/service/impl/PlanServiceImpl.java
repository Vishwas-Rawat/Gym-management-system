package com.gymmanagement.usermanagement.service.impl;

import com.gymmanagement.commonservices.entity.Plan;
import com.gymmanagement.commonservices.entity.Gym;
import com.gymmanagement.usermanagement.repository.PlanRepository;
import com.gymmanagement.usermanagement.repository.GymRepository;
import com.gymmanagement.usermanagement.service.PlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanServiceImpl implements PlanService {

    private final PlanRepository planRepository;
    private final GymRepository gymRepository;

    @Override
    public List<Plan> getAllPlansByGym(Long gymId) {
        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new IllegalArgumentException("Gym not found"));
        return planRepository.findByGymAndIsActiveTrue(gym);
    }

    @Override
    public Plan createPlan(Plan plan) {
        return planRepository.save(plan);
    }

    @Override
    public Plan updatePlan(Integer id, Plan planDetails) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Plan not found"));
        plan.setName(planDetails.getName());
        plan.setDurationMonths(planDetails.getDurationMonths());
        plan.setPrice(planDetails.getPrice());
        plan.setFreeMonths(planDetails.getFreeMonths());
        return planRepository.save(plan);
    }

    @Override
    public void deactivatePlan(Integer id) {
        Plan plan = planRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Plan not found"));
        plan.setIsActive(false);
        planRepository.save(plan);
    }

    @Override
    public Plan getPlanById(Integer id) {
        return planRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Plan not found"));
    }
}
