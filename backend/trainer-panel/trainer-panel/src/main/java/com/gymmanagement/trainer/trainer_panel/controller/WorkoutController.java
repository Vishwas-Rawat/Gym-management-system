package com.gymmanagement.trainer.trainer_panel.controller;

import com.gymmanagement.trainer.trainer_panel.dto.*;
import com.gymmanagement.trainer.trainer_panel.security.TrainerPrincipal;
import com.gymmanagement.trainer.trainer_panel.security.MemberPrincipal;
import com.gymmanagement.trainer.trainer_panel.service.TrainerWorkoutServiceImpl;
import com.gymmanagement.trainer.trainer_panel.repository.MemberRepository;

import com.gymmanagement.commonservices.entity.Member;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workout")
public class WorkoutController {

    private final TrainerWorkoutServiceImpl workoutService;
    private final MemberRepository memberRepo;

    public WorkoutController(TrainerWorkoutServiceImpl workoutService,
            MemberRepository memberRepo) {
        this.workoutService = workoutService;
        this.memberRepo = memberRepo;
    }

    // -------------------------
    // ASSIGN WORKOUT PLAN
    // -------------------------
    @PostMapping("/assign")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<WorkoutAssignSuccessResponse> assignWorkoutPlan(
            @RequestBody AssignWorkoutRequest request,
            Authentication auth) {

        Object p = auth.getPrincipal();

        if (!(p instanceof TrainerPrincipal tp)) {
            return ResponseEntity.status(403).build();
        }

        Integer trainerId = tp.trainerId();
        WorkoutAssignSuccessResponse resp = workoutService.assignWorkoutPlan(trainerId, request);

        return ResponseEntity.ok(resp);
    }

    // -------------------------
    // GET MEMBERS ASSIGNED TO TRAINER
    // -------------------------
    @GetMapping("/my-members")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<ViewMemberResponse>> getMyMembers(
            Authentication auth, @RequestParam Long gymId) {

        Object p = auth.getPrincipal();

        if (!(p instanceof TrainerPrincipal tp)) {
            return ResponseEntity.status(403).build();
        }

        Integer trainerId = tp.trainerId();
        List<ViewMemberResponse> members = workoutService.getAssignedMembers(gymId, trainerId);

        return ResponseEntity.ok(members);
    }

    // -------------------------
    // GET PLAN FOR SPECIFIC MEMBER
    // -------------------------
    @GetMapping("/member/{memberId}/plan")
    public ResponseEntity<WorkoutPlanResponse> getMemberPlan(@PathVariable Integer memberId) {
        return ResponseEntity.ok(workoutService.getLatestPlanForMember(memberId));
    }

    // -------------------------
    // MEMBER: GET MY PLAN
    // -------------------------
    @GetMapping("/my-plan")
    @PreAuthorize("hasAnyRole('MEMBER','TRAINER')")
    public ResponseEntity<WorkoutPlanResponse> getMyPlan(Authentication auth) {

        Object principal = auth.getPrincipal();
        Integer userId;

        // Trainer trying to call my-plan? Use trainer userId
        if (principal instanceof TrainerPrincipal tp) {
            userId = tp.userId();
        }
        // Correct member principal
        else if (principal instanceof MemberPrincipal mp) {
            userId = mp.userId();
        }
        // Fallback (rare)
        else {
            return ResponseEntity.status(403).build();
        }

        // Convert userId → Member
        Member member = memberRepo.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("No member found for userId " + userId));

        // Use MEMBER-ID (VERY IMPORTANT)
        WorkoutPlanResponse resp = workoutService.getLatestPlanForMember(member.getMemberId());

        return ResponseEntity.ok(resp);
    }
}
