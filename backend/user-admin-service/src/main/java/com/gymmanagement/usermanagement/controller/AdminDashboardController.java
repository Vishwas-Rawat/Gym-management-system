package com.gymmanagement.usermanagement.controller;

import com.gymmanagement.usermanagement.Response.DashboardResponse;
import com.gymmanagement.usermanagement.service.DashboardService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/{gymId}")
    public DashboardResponse getDashboard(@PathVariable Long gymId) {
        return dashboardService.getDashboard(gymId);
    }
}
