package com.gymmanagement.trainer.trainer_panel.controller;

import com.gymmanagement.trainer.trainer_panel.security.TrainerPrincipal;
import com.gymmanagement.trainer.trainer_panel.service.TrainerDashboardService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({ "/trainer/dashboard", "/trainer/board" })
@RequiredArgsConstructor
public class TrainerDashboardController {

    private final TrainerDashboardService dashboardService;

    @GetMapping
    public ResponseEntity<?> getDashboard(Authentication auth) {

        Object principal = auth.getPrincipal();

        if (principal instanceof TrainerPrincipal p) {
            Integer trainerUserId = p.userId();
            return ResponseEntity.ok(dashboardService.getDashboard(trainerUserId));
        }

        if (principal instanceof com.gymmanagement.trainer.trainer_panel.security.AdminPrincipal) {
            return ResponseEntity.badRequest().body(
                    "Admins cannot view a personal trainer dashboard directly. Please use the Admin specific endpoints.");
        }

        return ResponseEntity.status(403).build();
    }

    @GetMapping("/active-members")
    public ResponseEntity<?> getActiveMembers(Authentication auth) {
        if (auth.getPrincipal() instanceof TrainerPrincipal p) {
            return ResponseEntity.ok(dashboardService.getActiveMembers(p.trainerId()));
        }
        return ResponseEntity.status(403).build();
    }

    @GetMapping("/consistency")
    public ResponseEntity<?> getConsistency(Authentication auth,
            @RequestParam(defaultValue = "true") boolean consistent) {
        if (auth.getPrincipal() instanceof TrainerPrincipal p) {
            return ResponseEntity.ok(dashboardService.getConsistencyStats(p.trainerId(), consistent));
        }
        return ResponseEntity.status(403).build();
    }

    @GetMapping("/requests")
    public ResponseEntity<?> getRequestSummary(Authentication auth) {
        if (auth.getPrincipal() instanceof TrainerPrincipal p) {
            return ResponseEntity.ok(dashboardService.getRequestSummary(p.trainerId()));
        }
        return ResponseEntity.status(403).build();
    }

    @GetMapping("/subscriptions")
    public ResponseEntity<?> getSubscriptionExpiries(Authentication auth) {
        if (auth.getPrincipal() instanceof TrainerPrincipal p) {
            return ResponseEntity.ok(dashboardService.getSubscriptionExpiries(p.trainerId()));
        }
        return ResponseEntity.status(403).build();
    }
}
