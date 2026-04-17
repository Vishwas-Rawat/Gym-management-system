package com.gymmanagement.trainer.trainer_panel.controller;

import com.gymmanagement.trainer.trainer_panel.dto.ViewMemberResponse;
import com.gymmanagement.trainer.trainer_panel.security.TrainerPrincipal;
import com.gymmanagement.trainer.trainer_panel.service.TrainerWorkoutService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trainer")
public class TrainerController {

    private final TrainerWorkoutService trainerService;

    public TrainerController(TrainerWorkoutService trainerService) {
        this.trainerService = trainerService;
    }

    @GetMapping("/members")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<ViewMemberResponse>> getMembersForTrainer(
            Authentication auth,
            @RequestParam Long gymId
    ) {
        TrainerPrincipal tp = (TrainerPrincipal) auth.getPrincipal();
        Integer trainerId = tp.trainerId();

        List<ViewMemberResponse> members = trainerService.getAssignedMembers(gymId, trainerId);
        return ResponseEntity.ok(members);
    }
}
