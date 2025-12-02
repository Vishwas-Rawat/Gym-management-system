package com.gymmanagement.trainer.trainer_panel.repository;

import com.gymmanagement.commonservices.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainerRepository extends JpaRepository<Trainer, Integer> {
    List<Trainer> findByGym_GymId(Long gymId);
}
