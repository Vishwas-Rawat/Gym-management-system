package com.gymmanagement.trainer.trainer_panel.repository;

import com.gymmanagement.commonservices.entity.DietPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DietPlanRepository extends JpaRepository<DietPlan, Integer> {
    Optional<DietPlan> findFirstByMemberIdOrderByCreatedAtDesc(Integer memberId);

    long countByTrainerId(Integer trainerId);

    boolean existsByMemberId(Integer memberId);
}
