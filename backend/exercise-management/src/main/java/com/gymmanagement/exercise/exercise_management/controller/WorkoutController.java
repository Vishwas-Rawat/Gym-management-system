package com.gymmanagement.exercise.exercise_management.controller;

import com.gymmanagement.exercise.exercise_management.client.UserManagementClient;
import com.gymmanagement.exercise.exercise_management.dto.*;
import com.gymmanagement.exercise.exercise_management.service.TrainerWorkoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workout")
@PreAuthorize("hasRole('TRAINER') or hasRole('MEMBER')")
public class WorkoutController {

    private final TrainerWorkoutService trainerWorkoutService;
    private final UserManagementClient userClient;

    public WorkoutController(TrainerWorkoutService trainerWorkoutService,
                             UserManagementClient userClient) {
        this.trainerWorkoutService = trainerWorkoutService;
        this.userClient = userClient;
    }

    @PostMapping("/assign")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<WorkoutPlanResponse> assignWorkoutPlan(
            @RequestBody AssignWorkoutRequest request,
            Authentication auth) {

        String email = auth.getName();
        UserManagementClient.UserResponse trainer = userClient.getUserByEmail(email);

        if (trainer == null || trainer.getUserId() == null) {
            throw new IllegalArgumentException("Trainer not found");
        }

        WorkoutPlanResponse response =
                trainerWorkoutService.assignWorkoutPlan(trainer.getUserId(), request);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-members")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<MemberDto>> getMyMembers(Authentication auth) {
        String email = auth.getName();
        UserManagementClient.UserResponse trainer = userClient.getUserByEmail(email);

        return ResponseEntity.ok(
                trainerWorkoutService.getMembersByTrainer(trainer.getUserId())
        );
    }

    @GetMapping("/member/{memberId}/plan")
    public ResponseEntity<WorkoutPlanResponse> getMemberPlan(@PathVariable Integer memberId) {
        return ResponseEntity.ok(trainerWorkoutService.getLatestPlanForMember(memberId));
    }

    @GetMapping("/my-plan")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<WorkoutPlanResponse> getMyPlan(Authentication auth) {
        String email = auth.getName();
        UserManagementClient.UserResponse member = userClient.getUserByEmail(email);

        return ResponseEntity.ok(
                trainerWorkoutService.getLatestPlanForMember(member.getUserId())
        );
    }
}
