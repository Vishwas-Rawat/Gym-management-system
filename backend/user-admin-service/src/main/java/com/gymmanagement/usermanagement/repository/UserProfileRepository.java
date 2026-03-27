package com.gymmanagement.usermanagement.repository;

import com.gymmanagement.commonservices.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Integer> {
    Optional<UserProfile> findByUser_UserId(Integer userId);

    @org.springframework.data.jpa.repository.Query("SELECT p FROM UserProfile p WHERE LOWER(CONCAT(p.firstName, ' ', COALESCE(p.lastName, ''))) LIKE LOWER(CONCAT('%', :query, '%'))")
    java.util.List<UserProfile> searchByName(@org.springframework.data.repository.query.Param("query") String query);
}
