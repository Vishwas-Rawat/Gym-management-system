package com.gymmanagement.trainer.trainer_panel.controller;

import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.trainer.trainer_panel.dto.DietPlanResponse;
import com.gymmanagement.trainer.trainer_panel.dto.WorkoutPlanResponse;
import com.gymmanagement.trainer.trainer_panel.security.MemberPrincipal;
import com.gymmanagement.trainer.trainer_panel.security.TrainerPrincipal;
import com.gymmanagement.trainer.trainer_panel.service.DietService;
import com.gymmanagement.trainer.trainer_panel.service.TrainerWorkoutService;
import com.gymmanagement.trainer.trainer_panel.repository.MemberRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberPlanController {

    private final MemberRepository memberRepo;
    private final TrainerWorkoutService workoutService;
    private final DietService dietService;

    // ------------------------------------------------------------------
    // 1️⃣ GET MY WORKOUT PLAN (MEMBER)
    // ------------------------------------------------------------------
    @GetMapping("/my-workout-plan")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<WorkoutPlanResponse> myWorkout(Authentication auth) {

        Integer userId = extractUserId(auth);

        Member member = memberRepo.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("No member linked with userId=" + userId));

        WorkoutPlanResponse resp = workoutService.getLatestPlanForMember(member.getMemberId());
        return ResponseEntity.ok(resp);
    }

    // ------------------------------------------------------------------
    // 2️⃣ GET MY DIET PLAN (MEMBER)
    // ------------------------------------------------------------------
    @GetMapping("/my-diet-plan")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<DietPlanResponse> myDiet(Authentication auth) {

        Integer userId = extractUserId(auth);

        Member member = memberRepo.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("No member linked with userId=" + userId));

        DietPlanResponse resp = dietService.getLatestDietForMember(member.getMemberId());
        return ResponseEntity.ok(resp);
    }

    // ------------------------------------------------------------------
    // Helper: Extract userId from principal
    // ------------------------------------------------------------------
    private Integer extractUserId(Authentication auth) {

        Object p = auth.getPrincipal();

        if (p instanceof MemberPrincipal mp) {
            return mp.userId();
        }
        if (p instanceof TrainerPrincipal tp) {
            return tp.userId();
        }

        throw new IllegalArgumentException("Invalid authentication principal");
    }
}
