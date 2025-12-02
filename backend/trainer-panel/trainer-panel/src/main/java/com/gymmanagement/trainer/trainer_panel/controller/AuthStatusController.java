package com.gymmanagement.trainer.trainer_panel.controller;

import com.gymmanagement.trainer.trainer_panel.dto.UserStatusResponse;
import com.gymmanagement.trainer.trainer_panel.security.MemberPrincipal;
import com.gymmanagement.trainer.trainer_panel.security.TrainerPrincipal;
import com.gymmanagement.trainer.trainer_panel.service.UserStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthStatusController {

    private final UserStatusService statusService;

    private record UserContext(Integer userId) {}

    private UserContext extractUser(Authentication auth) {
        Object p = auth.getPrincipal();

        if (p instanceof TrainerPrincipal tp) {
            return new UserContext(tp.userId());
        }
        if (p instanceof MemberPrincipal mp) {
            return new UserContext(mp.userId());
        }

        throw new RuntimeException("Invalid principal");
    }

    @GetMapping("/check-status")
    public ResponseEntity<UserStatusResponse> checkStatus(Authentication auth) {
        var ctx = extractUser(auth);
        UserStatusResponse response = statusService.checkStatus(ctx.userId());
        return ResponseEntity.ok(response);
    }
}
