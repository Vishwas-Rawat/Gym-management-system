package com.gymmanagement.trainer.trainer_panel.repository;

import com.gymmanagement.commonservices.entity.WorkoutPlanItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkoutPlanItemRepository extends JpaRepository<WorkoutPlanItem, Integer> {
}
