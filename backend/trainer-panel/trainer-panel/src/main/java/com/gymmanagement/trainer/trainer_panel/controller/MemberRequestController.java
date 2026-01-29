package com.gymmanagement.trainer.trainer_panel.controller;

import com.gymmanagement.trainer.trainer_panel.dto.RequestCreateDto;
import com.gymmanagement.trainer.trainer_panel.dto.RequestResponse;
import com.gymmanagement.trainer.trainer_panel.service.RequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberRequestController {

    // Dependency Injection
    private final RequestService requestService;
    private final com.gymmanagement.trainer.trainer_panel.repository.MemberRepository memberRepo;

    // Helper method to extract Member Entity directly
    private com.gymmanagement.commonservices.entity.Member getMember(
            org.springframework.security.core.Authentication auth) {
        System.out.println("DEBUG: getMember called with auth: " + auth);
        Object principal = auth.getPrincipal();

        Integer userId = null;

        if (principal instanceof com.gymmanagement.trainer.trainer_panel.security.MemberPrincipal mp) {
            userId = mp.userId();
            System.out.println("DEBUG: Principal is MemberPrincipal. userId=" + userId);
        } else {
            System.out.println("ERROR: Expected MemberPrincipal but got: " + principal.getClass().getName());
            throw new IllegalArgumentException(
                    "Invalid Authentication Principal: " + principal.getClass().getSimpleName());
        }

        if (userId == null) {
            System.out.println("ERROR: UserId is NULL. Cannot fetch Member.");
            throw new IllegalArgumentException("User ID is NULL in token. Please relogin.");
        }

        final Integer finalUserId = userId;
        System.out.println("DEBUG: Looking up member for userId: " + userId);
        return memberRepo.findByUser_UserId(userId)
                .orElseThrow(() -> {
                    System.out.println("DEBUG: Member NOT FOUND for userId: " + finalUserId);
                    return new IllegalArgumentException("Member not found for user ID: " + finalUserId);
                });
    }

    // Member posts diet request
    @PostMapping("/request/diet")
    public ResponseEntity<RequestResponse> requestDiet(@RequestBody RequestCreateDto dto,
            org.springframework.security.core.Authentication auth) {

        var member = getMember(auth);
        dto.setMemberId(member.getMemberId());

        // Auto-assign trainer if not provided AND member has one
        if (dto.getTrainerId() == null && member.getTrainer() != null) {
            dto.setTrainerId(member.getTrainer().getTrainerId());
        }

        return ResponseEntity.ok(requestService.createDietRequest(dto));
    }

    // Member posts workout request
    @PostMapping("/request/workout")
    public ResponseEntity<RequestResponse> requestWorkout(@RequestBody RequestCreateDto dto,
            org.springframework.security.core.Authentication auth) {

        var member = getMember(auth);
        dto.setMemberId(member.getMemberId());

        // Auto-assign trainer if not provided AND member has one
        if (dto.getTrainerId() == null && member.getTrainer() != null) {
            dto.setTrainerId(member.getTrainer().getTrainerId());
        }

        return ResponseEntity.ok(requestService.createWorkoutRequest(dto));
    }

    // GET MY REQUESTS (Combined or Separate)
    // Frontend calls: /member/requests/my
    @GetMapping("/requests/my")
    public ResponseEntity<?> getMyRequests(org.springframework.security.core.Authentication auth) {
        var member = getMember(auth);

        List<RequestResponse> diets = requestService.getDietRequestsForMember(member.getMemberId());
        List<RequestResponse> workouts = requestService.getWorkoutRequestsForMember(member.getMemberId());

        List<RequestResponse> all = new java.util.ArrayList<>();
        all.addAll(diets);
        all.addAll(workouts);

        // Sort by date desc
        all.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));

        return ResponseEntity.ok(all);
    }

    // UPDATE & DELETE - DIET
    @PutMapping("/request/diet/{requestId}")
    public ResponseEntity<RequestResponse> updateDietRequest(@PathVariable Integer requestId,
            @RequestBody RequestCreateDto dto,
            org.springframework.security.core.Authentication auth) {
        // Ensure user is valid member
        getMember(auth);
        return ResponseEntity.ok(requestService.updateDietRequest(requestId, dto.getMessage()));
    }

    @DeleteMapping("/request/diet/{requestId}")
    public ResponseEntity<com.gymmanagement.trainer.trainer_panel.dto.ApiResponse> deleteDietRequest(
            @PathVariable Integer requestId,
            org.springframework.security.core.Authentication auth) {
        // Ensure user is valid member
        getMember(auth);
        requestService.deleteDietRequest(requestId);
        return ResponseEntity.ok(
                new com.gymmanagement.trainer.trainer_panel.dto.ApiResponse(true, "Request cancelled successfully"));
    }

    // UPDATE & DELETE - WORKOUT
    @PutMapping("/request/workout/{requestId}")
    public ResponseEntity<RequestResponse> updateWorkoutRequest(@PathVariable Integer requestId,
            @RequestBody RequestCreateDto dto,
            org.springframework.security.core.Authentication auth) {
        // Ensure user is valid member
        getMember(auth);
        return ResponseEntity.ok(requestService.updateWorkoutRequest(requestId, dto.getMessage()));
    }

    @DeleteMapping("/request/workout/{requestId}")
    public ResponseEntity<com.gymmanagement.trainer.trainer_panel.dto.ApiResponse> deleteWorkoutRequest(
            @PathVariable Integer requestId,
            org.springframework.security.core.Authentication auth) {
        // Ensure user is valid member
        getMember(auth);
        requestService.deleteWorkoutRequest(requestId);
        return ResponseEntity.ok(
                new com.gymmanagement.trainer.trainer_panel.dto.ApiResponse(true, "Request cancelled successfully"));
    }
}
