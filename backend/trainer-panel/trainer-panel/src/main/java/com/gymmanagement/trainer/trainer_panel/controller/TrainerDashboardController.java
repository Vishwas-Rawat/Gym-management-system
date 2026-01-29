package com.gymmanagement.trainer.trainer_panel.controller;

import com.gymmanagement.trainer.trainer_panel.dto.TrainerDashboardResponse;
import com.gymmanagement.trainer.trainer_panel.security.TrainerPrincipal;
import com.gymmanagement.trainer.trainer_panel.service.TrainerDashboardService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/trainer/dashboard")
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
}
