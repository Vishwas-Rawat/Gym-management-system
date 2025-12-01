package com.gymmanagement.trainer.trainer_panel.controller;

import com.gymmanagement.trainer.trainer_panel.dto.RequestResponse;
import com.gymmanagement.trainer.trainer_panel.service.RequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trainer/requests")
@RequiredArgsConstructor
public class TrainerRequestController {

    private final RequestService requestService;

    @GetMapping("/diet")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<RequestResponse>> getDietRequests(@RequestParam Integer trainerId) {
        return ResponseEntity.ok(requestService.getDietRequestsForTrainer(trainerId));
    }

    @GetMapping("/workout")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<RequestResponse>> getWorkoutRequests(@RequestParam Integer trainerId) {
        return ResponseEntity.ok(requestService.getWorkoutRequestsForTrainer(trainerId));
    }
}
