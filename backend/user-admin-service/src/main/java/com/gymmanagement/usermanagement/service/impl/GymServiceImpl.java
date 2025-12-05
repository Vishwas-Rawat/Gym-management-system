package com.gymmanagement.usermanagement.service.impl;

import com.gymmanagement.commonservices.entity.Gym;
import com.gymmanagement.commonservices.entity.User;
import com.gymmanagement.commonservices.enumeration.Role;
import com.gymmanagement.usermanagement.Response.GymRegisterResponse;
import com.gymmanagement.usermanagement.repository.GymRepository;
import com.gymmanagement.usermanagement.repository.UserRepository;
import com.gymmanagement.usermanagement.service.GymService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GymServiceImpl implements GymService {

    private final GymRepository gymRepository;
    private final UserRepository userRepository;

    @PersistenceContext
    private EntityManager entityManager;

    // CREATE gyms for admin
    @Override
    @Transactional
    public List<GymRegisterResponse> createGyms(List<Gym> gyms, String adminEmail) {
        User admin = getAdminByEmail(adminEmail);

        entityManager.flush();
        entityManager.clear();

        return gyms.stream().map(gym -> {
            validateUniqueGym(gym, admin);

            gym.setGymName(gym.getGymName().trim());
            gym.setAddress(gym.getAddress().trim());
            gym.setCity(gym.getCity().trim());
            gym.setCreatedByAdmin(admin);
            gym.setCreatedAt(LocalDateTime.now());
            gym.setUpdatedAt(LocalDateTime.now());
            gym.setIsActive(true);

            Gym saved = gymRepository.save(gym);
            return toResponse(saved, admin, "Gym created successfully");
        }).collect(Collectors.toList());
    }

    // GET all gyms for logged admin
    @Override
    public List<GymRegisterResponse> getAllGymsByAdmin(String adminEmail) {
        User admin = getAdminByEmail(adminEmail);

        List<Gym> gyms = gymRepository.findByCreatedByAdminAndIsActiveTrue(admin);
        if (gyms.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No active gyms found for this admin");
        }

        return gyms.stream().map(gym -> toResponse(gym, admin, null)).collect(Collectors.toList());
    }

    // UPDATE gym
    @Override
    @Transactional
    public GymRegisterResponse updateGym(Long gymId, Gym updatedGym, String adminEmail) {
        User admin = getAdminByEmail(adminEmail);
        Gym existing = gymRepository.findById(gymId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Gym not found"));

        if (!Objects.equals(existing.getCreatedByAdmin().getUserId(), admin.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to update this gym");
        }

        updateFields(existing, updatedGym);
        existing.setUpdatedAt(LocalDateTime.now());

        Gym saved = gymRepository.save(existing);
        return toResponse(saved, admin, "Gym updated successfully");
    }

    // DELETE gym (soft delete)
    @Override
    @Transactional
    public boolean softDeleteGym(Long gymId, String adminEmail) {
        User admin = getAdminByEmail(adminEmail);
        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Gym not found"));

        if (!Objects.equals(gym.getCreatedByAdmin().getUserId(), admin.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized: You cannot delete this gym");
        }

        gym.setIsActive(false);
        gym.setUpdatedAt(LocalDateTime.now());
        gymRepository.save(gym);
        return true;
    }

    // Validate uniqueness
    private void validateUniqueGym(Gym gym, User admin) {
        boolean exists = gymRepository.existsByGymNameIgnoreCaseAndAddressIgnoreCaseAndCityIgnoreCaseAndCreatedByAdmin_UserId(
                gym.getGymName().trim(),
                gym.getAddress().trim(),
                gym.getCity().trim(),
                admin.getUserId()
        );
        if (exists) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Gym already exists: " + gym.getGymName() + " at " + gym.getAddress());
        }
    }

    // Update only available fields
    private void updateFields(Gym existing, Gym updated) {
        if (updated.getGymName() != null) existing.setGymName(updated.getGymName().trim());
        if (updated.getAddress() != null) existing.setAddress(updated.getAddress().trim());
        if (updated.getCity() != null) existing.setCity(updated.getCity().trim());
        if (updated.getState() != null) existing.setState(updated.getState());
        if (updated.getContactNumber() != null) existing.setContactNumber(updated.getContactNumber());
        if (updated.getEmail() != null) existing.setEmail(updated.getEmail());
        if (updated.getOpeningHours() != null) existing.setOpeningHours(updated.getOpeningHours());
    }

    // Admin lookup
    private User getAdminByEmail(String email) {
        User admin = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Admin not found"));

        if (admin.getRole() != Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can perform this action");
        }
        return admin;
    }

    // Response builder
    private GymRegisterResponse toResponse(Gym gym, User admin, String message) {
        return GymRegisterResponse.builder()
                .gymId(gym.getGymId())
                .gymName(gym.getGymName())
                .address(gym.getAddress())
                .city(gym.getCity())
                .state(gym.getState())
                .contactNumber(gym.getContactNumber())
                .email(gym.getEmail())
                .openingHours(gym.getOpeningHours())
                .adminId(admin.getUserId())
                .message(message)
                .isActive(gym.getIsActive())
                .createdAt(gym.getCreatedAt())
                .updatedAt(gym.getUpdatedAt())
                .build();
    }
}
