package com.gymmanagement.trainer.trainer_panel.repository;

import com.gymmanagement.commonservices.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
}
