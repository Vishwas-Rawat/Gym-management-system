package com.gymmanagement.trainer.trainer_panel.controller;

import com.gymmanagement.trainer.trainer_panel.dto.MemberDashboardSummaryDTO;
import com.gymmanagement.trainer.trainer_panel.security.MemberPrincipal;
import com.gymmanagement.trainer.trainer_panel.security.TrainerPrincipal;
import com.gymmanagement.trainer.trainer_panel.service.MemberDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/member/dashboard")
@RequiredArgsConstructor
public class MemberDashboardController {

    private final MemberDashboardService memberDashboardService;

    @GetMapping("/summary")
    public ResponseEntity<MemberDashboardSummaryDTO> getSummary(Authentication auth) {
        Integer userId = extractUserId(auth);
        return ResponseEntity.ok(memberDashboardService.getMemberSummary(userId));
    }

    private Integer extractUserId(Authentication auth) {
        Object p = auth.getPrincipal();
        if (p instanceof MemberPrincipal mp) {
            return mp.userId();
        }
        if (p instanceof TrainerPrincipal tp) {
            return tp.userId();
        }
        throw new IllegalArgumentException("Invalid authentication principal");
    }
}
