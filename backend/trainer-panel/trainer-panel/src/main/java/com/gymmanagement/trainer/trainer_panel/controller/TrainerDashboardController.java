package com.gymmanagement.trainer.trainer_panel.controller;

import com.gymmanagement.trainer.trainer_panel.dto.dashboard.*;
import com.gymmanagement.trainer.trainer_panel.security.TrainerPrincipal;
import com.gymmanagement.trainer.trainer_panel.service.TrainerDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trainer/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasRole('TRAINER')")
public class TrainerDashboardController {

    private final TrainerDashboardService dashboardService;

    private Integer getTrainerId(Authentication auth) {
        TrainerPrincipal tp = (TrainerPrincipal) auth.getPrincipal();
        return tp.trainerId();
    }

    @GetMapping("/my-stats")
    public ResponseEntity<TrainerStatsDTO> getMyStats(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getStats(getTrainerId(auth)));
    }

    @GetMapping("/my-members")
    public ResponseEntity<List<MyMemberDTO>> getMyMembers(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getMyMembers(getTrainerId(auth)));
    }

    @GetMapping("/today-attendance")
    public ResponseEntity<List<TodayAttendanceDTO>> getTodayAttendance(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getTodayAttendance(getTrainerId(auth)));
    }

    @GetMapping("/inactive-members")
    public ResponseEntity<List<InactiveMemberDTO>> getInactiveMembers(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getInactiveMembers(getTrainerId(auth)));
    }

    @GetMapping("/upcoming-birthdays")
    public ResponseEntity<List<UpcomingBirthdayDTO>> getUpcomingBirthdays(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getUpcomingBirthdays(getTrainerId(auth)));
    }

    @GetMapping("/diet-compliance")
    public ResponseEntity<ComplianceDTO> getDietCompliance(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getDietCompliance(getTrainerId(auth)));
    }

    @GetMapping("/workout-compliance")
    public ResponseEntity<ComplianceDTO> getWorkoutCompliance(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getWorkoutCompliance(getTrainerId(auth)));
    }

    @GetMapping("/revenue-share")
    public ResponseEntity<RevenueShareDTO> getRevenueShare(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getRevenueShare(getTrainerId(auth)));
    }
}
