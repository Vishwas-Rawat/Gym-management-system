package com.gymmanagement.usermanagement.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gymmanagement.commonservices.entity.Gym;
import com.gymmanagement.commonservices.entity.User;
import com.gymmanagement.commonservices.enumeration.Role;
import com.gymmanagement.usermanagement.Response.GymRegisterResponse;
import com.gymmanagement.usermanagement.repository.GymRepository;
import com.gymmanagement.usermanagement.repository.UserRepository;
import com.gymmanagement.usermanagement.service.GymService;

@Service
public class GymServiceImpl implements GymService {

    @Autowired
    private GymRepository gymRepository;

    @Autowired
    private UserRepository userRepository;

    @PersistenceContext
    private EntityManager entityManager;

    // ✅ Allow multiple gym creation with clean transaction boundaries
    @Override
    @Transactional
    public List<GymRegisterResponse> createGyms(List<Gym> gyms, Integer adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only admin can create gym details");
        }

        // 💡 Clear Hibernate cache to prevent stale false positives
        entityManager.flush();
        entityManager.clear();

        return gyms.stream().map(gym -> {
            // ✅ Normalize inputs (avoid case & whitespace issues)
            String gymName = gym.getGymName().trim();
            String address = gym.getAddress().trim();
            String city = gym.getCity().trim();

            boolean gymExists = gymRepository.existsByGymNameIgnoreCaseAndAddressIgnoreCaseAndCityIgnoreCaseAndCreatedByAdmin_UserId(
                    gymName, address, city, admin.getUserId()
            );

            if (gymExists) {
                throw new RuntimeException("Gym with same name and address already exists for this admin: " + gymName);
            }

            gym.setGymName(gymName);
            gym.setAddress(address);
            gym.setCity(city);
            gym.setCreatedByAdmin(admin);
            gym.setCreatedAt(LocalDateTime.now());
            gym.setUpdatedAt(LocalDateTime.now());

            Gym savedGym = gymRepository.save(gym);
            return toResponse(savedGym, admin, "Gym created successfully");

        }).collect(Collectors.toList());
    }

    // ✅ Get all Gyms created by Admin
    @Override
    public List<GymRegisterResponse> getAllGymsByAdmin(int adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        List<Gym> gyms = gymRepository.findByCreatedByAdmin(admin);
        if (gyms.isEmpty()) {
            throw new RuntimeException("No gyms found for this admin");
        }

        return gyms.stream()
                .map(gym -> toResponse(gym, admin, "Gym details fetched successfully"))
                .collect(Collectors.toList());
    }

    // ✅ Update Gym (only if belongs to the same admin)
    @Override
    @Transactional
    public GymRegisterResponse updateGym(Long gymId, Gym updatedGym, Integer adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Gym existingGym = gymRepository.findById(gymId)
                .orElseThrow(() -> new RuntimeException("Gym not found"));

        if (existingGym.getCreatedByAdmin() == null 
                || existingGym.getCreatedByAdmin().getUserId() != (adminId)) {
            throw new RuntimeException("You are not authorized to update this gym");
        }

        // ✅ Update only non-null fields
        if (updatedGym.getGymName() != null) existingGym.setGymName(updatedGym.getGymName());
        if (updatedGym.getAddress() != null) existingGym.setAddress(updatedGym.getAddress());
        if (updatedGym.getCity() != null) existingGym.setCity(updatedGym.getCity());
        if (updatedGym.getState() != null) existingGym.setState(updatedGym.getState());
        if (updatedGym.getContactNumber() != null) existingGym.setContactNumber(updatedGym.getContactNumber());
        if (updatedGym.getEmail() != null) existingGym.setEmail(updatedGym.getEmail());
        if (updatedGym.getOpeningHours() != null) existingGym.setOpeningHours(updatedGym.getOpeningHours());

        existingGym.setUpdatedAt(LocalDateTime.now());
        Gym savedGym = gymRepository.save(existingGym);

        return toResponse(savedGym, admin, "Gym updated successfully");
    }

    // ✅ Helper method to convert Entity → DTO
    private GymRegisterResponse toResponse(Gym gym, User admin, String message) {
        return new GymRegisterResponse(
                gym.getGymId(),
                gym.getGymName(),
                gym.getAddress(),
                gym.getCity(),
                gym.getState(),
                gym.getContactNumber(),
                gym.getEmail(),
                gym.getOpeningHours(),
                admin.getUserId(),
                message
        );
    }
    
    @Override
    public boolean softDeleteGym(Long gymId, Integer adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new RuntimeException("Gym not found"));

        // Ensure only creator can delete
        if (gym.getCreatedByAdmin().getUserId() != (admin.getUserId())) {
            throw new RuntimeException("Unauthorized: You cannot delete this gym");
        }

        gym.setIsActive(false);
        gymRepository.save(gym);

        return true;
    }

}
