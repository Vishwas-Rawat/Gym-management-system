package com.gymmanagement.trainer.trainer_panel.controller;

import com.gymmanagement.trainer.trainer_panel.dto.TrainerDashboardResponse;
import com.gymmanagement.trainer.trainer_panel.security.TrainerPrincipal;
import com.gymmanagement.trainer.trainer_panel.service.TrainerDashboardService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/trainer/dashboard")
@RequiredArgsConstructor
public class TrainerDashboardController {

    private final TrainerDashboardService dashboardService;

    @GetMapping
    public TrainerDashboardResponse getDashboard(Authentication auth) {

        TrainerPrincipal p = (TrainerPrincipal) auth.getPrincipal();
        Integer trainerUserId = p.userId();

        return dashboardService.getDashboard(trainerUserId);
    }
}
