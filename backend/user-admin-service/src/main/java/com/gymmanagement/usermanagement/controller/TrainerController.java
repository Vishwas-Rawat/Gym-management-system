package com.gymmanagement.usermanagement.controller;

import com.gymmanagement.commonservices.entity.Trainer;
import com.gymmanagement.usermanagement.Request.AddTrainerRequest;
import com.gymmanagement.usermanagement.Request.AssignMembersToTrainerRequest;
import com.gymmanagement.usermanagement.Request.CompleteTrainerRegistrationRequest;
import com.gymmanagement.usermanagement.Request.UpdateTrainerRequest;
import com.gymmanagement.usermanagement.Request.TrainerProfileUpdateRequest;
import com.gymmanagement.usermanagement.Response.AddTrainerResponse;
import com.gymmanagement.usermanagement.Response.ApiResponse;
import com.gymmanagement.usermanagement.Response.MemberAssignmentResponse;
import com.gymmanagement.usermanagement.Response.TrainerProfileResponse;
import com.gymmanagement.usermanagement.Response.TrainerResponse;
import com.gymmanagement.usermanagement.repository.TrainerRepository;
import com.gymmanagement.usermanagement.service.TrainerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.validation.annotation.Validated;

import org.springframework.security.core.Authentication;
import com.gymmanagement.commonservices.entity.User;
import com.gymmanagement.commonservices.enumeration.Role;
import java.util.List;

@RestController
@Validated
@RequestMapping("/trainer") // ← Important: Base path
public class TrainerController {

    @Autowired
    private TrainerService trainerService;

    @Autowired
    private TrainerRepository trainerRepository;

    // 1. ADMIN: Add one or multiple trainers
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/add-trainers")
    public ResponseEntity<List<AddTrainerResponse>> addTrainers(@RequestBody List<@Valid AddTrainerRequest> requests) {
        List<AddTrainerResponse> responses = trainerService.addTrainersByAdmin(requests);
        return ResponseEntity.ok(responses);
    }

    // 2. ADMIN: Resend registration link
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/trainer/{userId}/resend")
    public ResponseEntity<ApiResponse> resendTrainerInvite(@PathVariable Integer userId) {
        trainerService.resendTrainerRegistrationLink(userId);
        return ResponseEntity.ok(new ApiResponse(true, "Registration link resent successfully!"));
    }

    // 3. PUBLIC: Trainer completes registration (no JWT needed!)
    @PostMapping("/complete-registration")
    public ResponseEntity<ApiResponse> completeTrainerRegistration(
            @Valid @RequestBody CompleteTrainerRegistrationRequest request) {
        trainerService.completeTrainerRegistration(request);
        return ResponseEntity
                .ok(new ApiResponse(true, "Trainer registration completed successfully! You can now log in."));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/{trainerId}")
    public ResponseEntity<TrainerResponse> updateTrainer(@PathVariable Integer trainerId,
            @RequestBody UpdateTrainerRequest request) {
        Trainer updated = trainerService.updateTrainer(trainerId, request);
        return ResponseEntity.ok(new TrainerResponse(updated));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/{trainerId}")
    public ResponseEntity<ApiResponse> deleteTrainer(@PathVariable Integer trainerId) {
        trainerService.deleteTrainer(trainerId);
        return ResponseEntity.ok(new ApiResponse(true, "Trainer deleted successfully (soft delete)"));
    }

    @GetMapping("/all")
    public ResponseEntity<List<TrainerResponse>> getAllTrainers(Authentication auth) {
        if (auth != null && auth.getPrincipal() instanceof User user) {
            if (Role.ADMIN.equals(user.getRole())) {
                return ResponseEntity.ok(trainerService.getTrainersByAdminId(user.getUserId()));
            }
        }
        // Fallback for non-admin or system wide (mapping to Response for consistency)
        return ResponseEntity.ok(trainerService.getAllActiveTrainers().stream()
                .map(TrainerResponse::new)
                .toList());
    }

    // ✅ NEW: Explicit endpoint to match Member API pattern
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/all/my-trainers")
    public ResponseEntity<List<TrainerResponse>> getMyTrainers(Authentication auth) {
        User admin = (User) auth.getPrincipal();
        List<TrainerResponse> responses = trainerService.getTrainersByAdminId(admin.getUserId());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{trainerId}")
    public ResponseEntity<TrainerResponse> getTrainer(@PathVariable Integer trainerId) {
        return ResponseEntity.ok(new TrainerResponse(trainerService.getTrainerById(trainerId)));
    }

    // SEARCH TRAINERS (by keyword)
    @GetMapping("/search")
    public ResponseEntity<List<TrainerResponse>> searchTrainers(
            @RequestParam String keyword, Authentication auth) {
        if (auth != null && auth.getPrincipal() instanceof User user) {
            if (Role.ADMIN.equals(user.getRole())) {
                return ResponseEntity.ok(trainerService.searchTrainersByAdminId(keyword, user.getUserId()));
            }
        }
        List<TrainerResponse> trainers = trainerService.searchTrainers(keyword);
        return ResponseEntity.ok(trainers);
    }

    // GET ALL TRAINERS BY GYM ID
    @GetMapping("/gym/{gymId}")
    public ResponseEntity<List<TrainerResponse>> getTrainersByGym(
            @PathVariable Long gymId) {
        List<TrainerResponse> trainers = trainerService.getTrainersByGymId(gymId);
        return ResponseEntity.ok(trainers);
    }

    // In TrainerController.java
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/assign-members")
    public ResponseEntity<MemberAssignmentResponse> assignMembersToTrainer(
            @RequestBody AssignMembersToTrainerRequest request) {
        try {
            MemberAssignmentResponse result = trainerService.assignMembersToTrainer(request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(MemberAssignmentResponse.builder()
                    .success(false)
                    .message(e.getMessage())
                    .build());
        }
    }

    @GetMapping("/user/{userId}/id")
    public Integer getTrainerIdByUser(@PathVariable Integer userId) {
        return trainerRepository.findByUser_UserId(userId).stream()
                .filter(t -> Boolean.TRUE.equals(t.getIsActive()))
                .map(Trainer::getTrainerId)
                .findFirst()
                .orElse(null);
    }

    @GetMapping("/{trainerId}/potential-members")
    public ResponseEntity<List<com.gymmanagement.usermanagement.Response.GymMemberResponse>> getPotentialMembers(
            @PathVariable Integer trainerId) {
        return ResponseEntity.ok(trainerService.getPotentialMembers(trainerId));
    }

    // ✅ NEW: Get My Profile (For Logged-in Trainer)
    @PreAuthorize("hasRole('TRAINER')")
    @GetMapping("/profile/me")
    public ResponseEntity<TrainerProfileResponse> getMyProfile(Authentication auth) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(trainerService.getTrainerProfileByUserId(user.getUserId()));
    }

    // ✅ NEW: Update My Profile
    @PreAuthorize("hasRole('TRAINER')")
    @PutMapping("/profile/me")
    public ResponseEntity<TrainerProfileResponse> updateMyProfile(
            Authentication auth,
            @RequestBody TrainerProfileUpdateRequest request) {
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(trainerService.updateTrainerProfile(user.getUserId(), request));
    }

}