package com.gymmanagement.trainer.trainer_panel.repository;

import com.gymmanagement.commonservices.entity.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TrainerRepository extends JpaRepository<Trainer, Integer> {
    List<Trainer> findByGym_GymId(Long gymId);

    List<Trainer> findByGym_CreatedByAdmin_UserId(Integer adminId);

    List<Trainer> findByGym_GymIdIn(List<Long> gymIds);

    java.util.Optional<Trainer> findByUser_UserId(Integer userId);

    @Query("SELECT t FROM Trainer t JOIN t.user u LEFT JOIN u.userProfile p " +
            "WHERE t.gym.gymId = :gymId AND (" +
            "t.fullName LIKE %:query% OR u.username LIKE %:query% OR p.firstName LIKE %:query% OR p.lastName LIKE %:query%)")
    List<Trainer> searchByGymAndName(@Param("gymId") Long gymId, @Param("query") String query);
}
