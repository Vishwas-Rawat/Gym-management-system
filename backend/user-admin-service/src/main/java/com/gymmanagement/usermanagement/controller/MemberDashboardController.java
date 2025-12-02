package com.gymmanagement.usermanagement.controller;

import com.gymmanagement.usermanagement.Response.MemberDashboardResponse;
import com.gymmanagement.usermanagement.service.MemberDashboardService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/member/dashboard")
@RequiredArgsConstructor
public class MemberDashboardController {

    private final MemberDashboardService memberDashboardService;

    @GetMapping("/{userId}")
    public MemberDashboardResponse getDashboard(@PathVariable Integer userId) {
        return memberDashboardService.getDashboard(userId);
    }
}
