package com.gymmanagement.usermanagement.service.impl;

import com.gymmanagement.commonservices.entity.Gym;
import com.gymmanagement.commonservices.entity.User;
import com.gymmanagement.commonservices.enumeration.Role;
import com.gymmanagement.usermanagement.Response.GymMinimalResponse;
import com.gymmanagement.usermanagement.Response.GymRegisterResponse;
import com.gymmanagement.usermanagement.repository.GymRepository;
import com.gymmanagement.usermanagement.repository.MemberRepository;
import com.gymmanagement.usermanagement.repository.TrainerRepository;
import com.gymmanagement.usermanagement.repository.UserRepository;
import com.gymmanagement.usermanagement.service.GymService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GymServiceImpl implements GymService {

    private final GymRepository gymRepository;
    private final UserRepository userRepository;
    private final MemberRepository memberRepository;
    private final TrainerRepository trainerRepository;

    @PersistenceContext
    private EntityManager entityManager;

    // CREATE: Multiple gyms
    @Override
    @Transactional
    public List<GymRegisterResponse> createGyms(List<Gym> gyms, Integer adminId) {
        User admin = getAdminById(adminId);

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

    // READ: Only active gyms for this admin
    @Override
    public List<GymRegisterResponse> getAllGymsByAdmin(int adminId) {
        User admin = getAdminById(adminId);

        List<Gym> gyms = gymRepository.findByCreatedByAdminAndIsActiveTrue(admin);
        if (gyms.isEmpty()) {
            throw new RuntimeException("No active gyms found for this admin");
        }

        return gyms.stream()
                .map(gym -> toResponse(gym, admin, null))
                .collect(Collectors.toList());
    }

    @Override
    public List<GymMinimalResponse> getMinimalGymsByAdmin(int adminId) {
        User admin = getAdminById(adminId);
        List<Gym> gyms = gymRepository.findByCreatedByAdminAndIsActiveTrue(admin);
        
        return gyms.stream()
                .map(gym -> GymMinimalResponse.builder()
                        .gymId(gym.getGymId())
                        .gymName(gym.getGymName())
                        .build())
                .collect(Collectors.toList());
    }

    // UPDATE: Only own gym
    @Override
    @Transactional
    public GymRegisterResponse updateGym(Long gymId, Gym updatedGym, Integer adminId) {
        User admin = getAdminById(adminId);
        Gym existing = gymRepository.findById(gymId)
                .orElseThrow(() -> new RuntimeException("Gym not found"));

        // Safe comparison
        if (!Objects.equals(existing.getCreatedByAdmin().getUserId(), adminId)) {
            throw new RuntimeException("You are not authorized to update this gym");
        }

        updateFields(existing, updatedGym);
        existing.setUpdatedAt(LocalDateTime.now());

        Gym saved = gymRepository.save(existing);
        return toResponse(saved, admin, "Gym updated successfully");
    }

    @Override
    @Transactional
    public boolean softDeleteGym(Long gymId, Integer adminId) {
        getAdminById(adminId);
        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new RuntimeException("Gym not found"));

        // Safe comparison
        if (!Objects.equals(gym.getCreatedByAdmin().getUserId(), adminId)) {
            throw new RuntimeException("Unauthorized: You cannot delete this gym");
        }

        // ✅ Check for Active Members
        long memberCount = memberRepository.countActiveMembers(gymId);
        if (memberCount > 0) {
            throw new RuntimeException("Cannot delete gym. It contains " + memberCount
                    + " active members. Please remove or transfer them first.");
        }

        // ✅ Check for Active Trainers
        long trainerCount = trainerRepository.countActiveTrainers(gymId);
        if (trainerCount > 0) {
            throw new RuntimeException(
                    "Cannot delete gym. It has " + trainerCount + " active trainers. Please remove them first.");
        }

        gym.setIsActive(false);
        gym.setUpdatedAt(LocalDateTime.now());
        gymRepository.save(gym);
        return true;
    }

    // ✅ FORCE DELETE: Cascading Soft Delete
    @Override
    @Transactional
    public void forceDeleteGym(Long gymId, Integer adminId) {
        User admin = getAdminById(adminId);
        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new RuntimeException("Gym not found"));

        if (!Objects.equals(gym.getCreatedByAdmin().getUserId(), adminId)) {
            throw new RuntimeException("Unauthorized: You cannot delete this gym");
        }

        LocalDateTime now = LocalDateTime.now();

        // 1. Soft Delete All Active Members
        List<com.gymmanagement.commonservices.entity.Member> activeMembers = memberRepository
                .findActiveMembersByGymId(gymId);
        for (com.gymmanagement.commonservices.entity.Member m : activeMembers) {
            m.setIsActive(false);
            m.setDeletedAt(now);
            m.setUpdatedAt(now);
            memberRepository.save(m);
        }

        // 2. Soft Delete All Active Trainers
        List<com.gymmanagement.commonservices.entity.Trainer> activeTrainers = trainerRepository
                .findActiveTrainersByGymId(gymId);
        for (com.gymmanagement.commonservices.entity.Trainer t : activeTrainers) {
            t.setIsActive(false);
            t.setDeleted(true);
            t.setDeletedAt(now);
            t.setUpdatedAt(now);
            trainerRepository.save(t);
        }

        // 3. Soft Delete Gym
        gym.setIsActive(false);
        gym.setUpdatedAt(now);
        gymRepository.save(gym);
    }

    // HELPER: Validate unique gym
    private void validateUniqueGym(Gym gym, User admin) {
        boolean exists = gymRepository
                .existsByGymNameIgnoreCaseAndAddressIgnoreCaseAndCityIgnoreCaseAndCreatedByAdmin_UserId(
                        gym.getGymName().trim(),
                        gym.getAddress().trim(),
                        gym.getCity().trim(),
                        admin.getUserId());
        if (exists) {
            throw new RuntimeException("Gym already exists: " + gym.getGymName() + " at " + gym.getAddress());
        }
    }

    // HELPER: Update only non-null fields
    private void updateFields(Gym existing, Gym updated) {
        if (updated.getGymName() != null)
            existing.setGymName(updated.getGymName().trim());
        if (updated.getAddress() != null)
            existing.setAddress(updated.getAddress().trim());
        if (updated.getCity() != null)
            existing.setCity(updated.getCity().trim());
        if (updated.getState() != null)
            existing.setState(updated.getState());
        if (updated.getContactNumber() != null)
            existing.setContactNumber(updated.getContactNumber());
        if (updated.getEmail() != null)
            existing.setEmail(updated.getEmail());
        if (updated.getOpeningHours() != null)
            existing.setOpeningHours(updated.getOpeningHours());
    }

    // HELPER: Get admin + role check
    private User getAdminById(Integer adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        if (admin.getRole() != Role.ADMIN) {
            throw new RuntimeException("Only admins can perform this action");
        }
        return admin;
    }

    // HELPER: Build response using @Builder
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