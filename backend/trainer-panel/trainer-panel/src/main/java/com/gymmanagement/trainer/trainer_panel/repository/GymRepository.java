package com.gymmanagement.trainer.trainer_panel.repository;

import com.gymmanagement.commonservices.entity.Gym;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GymRepository extends JpaRepository<Gym, Long> {
    List<Gym> findByCreatedByAdmin_UserId(Integer userId);
}
