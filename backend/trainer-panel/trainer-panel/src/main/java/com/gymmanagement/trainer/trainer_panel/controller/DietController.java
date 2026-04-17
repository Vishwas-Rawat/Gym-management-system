package com.gymmanagement.trainer.trainer_panel.controller;

import com.gymmanagement.trainer.trainer_panel.dto.*;
import com.gymmanagement.trainer.trainer_panel.security.TrainerPrincipal;
import com.gymmanagement.trainer.trainer_panel.client.UserManagementClient;
import com.gymmanagement.trainer.trainer_panel.service.DietService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/diet")
@RequiredArgsConstructor
public class DietController {

    private final DietService dietService;
    private final UserManagementClient userClient;

    // -----------------------------
    // TRAINER → ASSIGN DIET
    // -----------------------------
    @PostMapping("/assign")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<DietPlanResponse> assignDiet(
            @RequestBody AssignDietRequest req,
            Authentication auth) {

        TrainerPrincipal tp = (TrainerPrincipal) auth.getPrincipal();
        Integer trainerId = tp.trainerId();

        return ResponseEntity.ok(dietService.assignDietPlan(trainerId, req));
    }

    // -----------------------------
    // TRAINER → VIEW MEMBER DIET
    // -----------------------------
    @GetMapping("/member/{memberId}/plan")
    public ResponseEntity<DietPlanResponse> getMemberDiet(@PathVariable Integer memberId) {
        return ResponseEntity.ok(
                dietService.getLatestDietForMember(memberId)
        );
    }

    // -----------------------------
    // MEMBER → VIEW MY DIET
    // -----------------------------
    @GetMapping("/my-plan")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<DietPlanResponse> getMyDiet(Authentication auth) {

        // 1️⃣ Email from JWT
        String email = auth.getName();

        // 2️⃣ Find userId
        UserResponse user = userClient.getUserByEmail(email);
        Integer userId = user.getUserId();

        // 3️⃣ Convert to memberId
        ViewMemberResponse m = userClient.getMemberByUserId(userId);
        Integer memberId = m.getMemberId();

        // 4️⃣ Return diet assigned to memberId
        return ResponseEntity.ok(dietService.getLatestDietForMember(memberId));
    }
}
