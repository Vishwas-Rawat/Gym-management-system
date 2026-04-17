package com.gymmanagement.usermanagement.controller;

import com.gymmanagement.usermanagement.Response.AdminProfileResponse;
import com.gymmanagement.usermanagement.Response.DashboardResponse;
import com.gymmanagement.usermanagement.service.DashboardService;
import com.gymmanagement.commonservices.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/dashboard/{gymId}")
    public DashboardResponse getDashboard(@PathVariable Long gymId) {
        return dashboardService.getDashboard(gymId);
    }

    @GetMapping("/profile/me")
    public ResponseEntity<AdminProfileResponse> getAdminProfile(Authentication auth) {
        User admin = (User) auth.getPrincipal();
        return ResponseEntity.ok(dashboardService.getAdminProfile(admin.getUserId()));
    }
}
