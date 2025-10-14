package com.gymmanagement.usermanagement.repository;

import com.gymmanagement.commonservices.entity.Trainer;
import com.gymmanagement.commonservices.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TrainerRepository extends JpaRepository<Trainer, Integer> {
    Optional<Trainer> findByUser_UserId(Integer userId);
    Optional<Trainer> findByUser(User user);  // ✅ add this

}
