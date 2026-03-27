package com.gymmanagement.trainer.trainer_panel.repository;

import com.gymmanagement.commonservices.entity.DietRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DietRequestRepository extends JpaRepository<DietRequest, Integer> {
    List<DietRequest> findByTrainerIdOrderByCreatedAtDesc(Integer trainerId);
    List<DietRequest> findByMemberIdOrderByCreatedAtDesc(Integer memberId);
}
