package com.gymmanagement.usermanagement.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.gymmanagement.commonservices.entity.Gym;
import com.gymmanagement.commonservices.entity.User;

public interface GymRepository extends JpaRepository<Gym, Long> {

    // To check duplicate gym for same admin (case-insensitive)
    boolean existsByGymNameIgnoreCaseAndAddressIgnoreCaseAndCityIgnoreCaseAndCreatedByAdmin_UserId(
            String gymName, String address, String city, Integer adminId);

    // Get only active gyms created by this admin
    List<Gym> findByCreatedByAdminAndIsActiveTrue(User admin);
}
