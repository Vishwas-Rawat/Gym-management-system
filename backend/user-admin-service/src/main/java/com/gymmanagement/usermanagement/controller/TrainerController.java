package com.gymmanagement.usermanagement.controller;

import com.gymmanagement.commonservices.entity.Trainer;
import com.gymmanagement.usermanagement.Request.AddTrainerRequest;
import com.gymmanagement.usermanagement.Request.AssignMembersToTrainerRequest;
import com.gymmanagement.usermanagement.Request.CompleteTrainerRegistrationRequest;
import com.gymmanagement.usermanagement.Request.UpdateTrainerRequest;
import com.gymmanagement.usermanagement.Response.AddTrainerResponse;
import com.gymmanagement.usermanagement.Response.ApiResponse;
import com.gymmanagement.usermanagement.Response.TrainerResponse;
import com.gymmanagement.usermanagement.repository.TrainerRepository;
import com.gymmanagement.usermanagement.service.TrainerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trainer") // ← Important: Base path
public class TrainerController {

    @Autowired
    private TrainerService trainerService;

    @Autowired
    private TrainerRepository trainerRepository;

    // 1. ADMIN: Add one or multiple trainers
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/add-trainers")
    public ResponseEntity<List<AddTrainerResponse>> addTrainers(@RequestBody List<AddTrainerRequest> requests) {
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
            @RequestBody CompleteTrainerRegistrationRequest request) {
        trainerService.completeTrainerRegistration(request);
        return ResponseEntity
                .ok(new ApiResponse(true, "Trainer registration completed successfully! You can now log in."));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{trainerId}")
    public ResponseEntity<Trainer> updateTrainer(@PathVariable Integer trainerId,
            @RequestBody UpdateTrainerRequest request) {
        Trainer updated = trainerService.updateTrainer(trainerId, request);
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{trainerId}")
    public ResponseEntity<ApiResponse> deleteTrainer(@PathVariable Integer trainerId) {
        trainerService.deleteTrainer(trainerId);
        return ResponseEntity.ok(new ApiResponse(true, "Trainer deleted successfully (soft delete)"));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Trainer>> getAllTrainers() {
        return ResponseEntity.ok(trainerService.getAllActiveTrainers());
    }

    @GetMapping("/{trainerId}")
    public ResponseEntity<Trainer> getTrainer(@PathVariable Integer trainerId) {
        return ResponseEntity.ok(trainerService.getTrainerById(trainerId));
    }

    // SEARCH TRAINERS (by keyword)
    @GetMapping("/search")
    public ResponseEntity<List<TrainerResponse>> searchTrainers(
            @RequestParam String keyword) {
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
    public ResponseEntity<ApiResponse> assignMembersToTrainer(
            @RequestBody AssignMembersToTrainerRequest request) {
        try {
            trainerService.assignMembersToTrainer(request);
            Trainer trainer = trainerRepository.findById(request.getTrainerId()).get();
            String trainerName = trainer.getUser().getUserProfile() != null
                    ? trainer.getUser().getUserProfile().getFirstName() + " " +
                            (trainer.getUser().getUserProfile().getLastName() != null
                                    ? trainer.getUser().getUserProfile().getLastName()
                                    : "")
                    : "Trainer";

            return ResponseEntity.ok(new ApiResponse(true,
                    request.getMemberIds().size() + " members successfully assigned to trainer " + trainerName));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @GetMapping("/trainer/user/{userId}/id")
    public Integer getTrainerIdByUser(@PathVariable Integer userId) {
        return trainerRepository.findByUser_UserId(userId)
                .map(Trainer::getTrainerId)
                .orElse(null);
    }

    @GetMapping("/{trainerId}/members")
    public ResponseEntity<List<com.gymmanagement.usermanagement.Response.GymMemberResponse>> getTrainerMembers(
            @PathVariable Integer trainerId) {
        return ResponseEntity.ok(trainerService.getMembersUnderTrainer(trainerId));
    }

}