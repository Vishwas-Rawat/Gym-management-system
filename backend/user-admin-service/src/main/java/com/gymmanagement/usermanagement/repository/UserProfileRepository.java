package com.gymmanagement.usermanagement.repository;

import com.gymmanagement.commonservices.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProfileRepository extends JpaRepository<UserProfile, Integer> {}
