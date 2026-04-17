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
    private final com.gymmanagement.trainer.trainer_panel.repository.TrainerRepository trainerRepo;

    // Helper: Extract Trainer ID from Token
    private Integer getTrainerId(java.security.Principal principal) {
        Integer userId;
        // 1. Try casting to TrainerPrincipal if available (best practice)
        if (principal instanceof com.gymmanagement.trainer.trainer_panel.security.TrainerPrincipal tp) {
            userId = tp.userId();
        } else {
            // 2. Fallback: Parse from Name (Username/ID)
            try {
                userId = Integer.parseInt(principal.getName());
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid User ID in token");
            }
        }

        // 3. Lookup Trainer Entity using User ID
        final Integer lookupId = userId;
        return trainerRepo.findByUser_UserId(lookupId)
                .orElseThrow(() -> new IllegalArgumentException("Trainer profile not found for User ID: " + lookupId))
                .getTrainerId();
    }

    @GetMapping("/diet")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<RequestResponse>> getDietRequests(java.security.Principal principal) {
        return ResponseEntity.ok(requestService.getDietRequestsForTrainer(getTrainerId(principal)));
    }

    @GetMapping("/workout")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<RequestResponse>> getWorkoutRequests(java.security.Principal principal) {
        return ResponseEntity.ok(requestService.getWorkoutRequestsForTrainer(getTrainerId(principal)));
    }

    @PostMapping("/diet/{requestId}/status")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<RequestResponse> updateDietStatus(
            @PathVariable Integer requestId,
            @RequestParam com.gymmanagement.commonservices.enumeration.RequestStatus status) {
        return ResponseEntity.ok(requestService.updateDietRequestStatus(requestId, status));
    }

    @PostMapping("/workout/{requestId}/status")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<RequestResponse> updateWorkoutStatus(
            @PathVariable Integer requestId,
            @RequestParam com.gymmanagement.commonservices.enumeration.RequestStatus status) {
        return ResponseEntity.ok(requestService.updateWorkoutRequestStatus(requestId, status));
    }
}
