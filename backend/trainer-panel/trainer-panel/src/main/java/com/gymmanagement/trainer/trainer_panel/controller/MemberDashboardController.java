package com.gymmanagement.trainer.trainer_panel.controller;

import com.gymmanagement.trainer.trainer_panel.client.UserManagementClient;
import com.gymmanagement.trainer.trainer_panel.dto.UserResponse;
import com.gymmanagement.trainer.trainer_panel.dto.ViewMemberResponse;
import com.gymmanagement.trainer.trainer_panel.security.MemberPrincipal;
import com.gymmanagement.trainer.trainer_panel.service.MemberDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/member/dashboard")
@RequiredArgsConstructor
public class MemberDashboardController {

    private final MemberDashboardService dashboardService;
    private final UserManagementClient userClient;

    private Integer getUserId(Authentication auth) {
        if (auth.getPrincipal() instanceof MemberPrincipal mp) {
            return mp.userId();
        }
        // Fallback for testing with other tokens if needed, but strictly should be
        // Member
        String email = auth.getName();
        return userClient.getUserByEmail(email).getUserId();
    }

    private Integer getMemberId(Integer userId) {
        ViewMemberResponse m = userClient.getMemberByUserId(userId);
        return m.getMemberId();
    }

    @GetMapping("/home")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<?> getHome(Authentication auth) {
        Integer userId = getUserId(auth);
        Integer memberId = getMemberId(userId);
        return ResponseEntity.ok(dashboardService.getHomeStats(memberId, userId));
    }

    @GetMapping("/today")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<?> getToday(Authentication auth) {
        Integer userId = getUserId(auth);
        Integer memberId = getMemberId(userId);
        return ResponseEntity.ok(dashboardService.getTodayStats(memberId, userId));
    }
}
