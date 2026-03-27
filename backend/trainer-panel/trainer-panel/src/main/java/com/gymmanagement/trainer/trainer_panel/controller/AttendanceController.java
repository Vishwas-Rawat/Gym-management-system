package com.gymmanagement.trainer.trainer_panel.controller;

import com.gymmanagement.trainer.trainer_panel.dto.AttendanceMarkResponse;
import com.gymmanagement.trainer.trainer_panel.security.AdminPrincipal;
import com.gymmanagement.trainer.trainer_panel.security.MemberPrincipal;
import com.gymmanagement.trainer.trainer_panel.security.TrainerPrincipal;
import com.gymmanagement.trainer.trainer_panel.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    private record UserContext(Integer userId, String role) {
    }

    private UserContext extractUser(Authentication auth) {
        Object p = auth.getPrincipal();

        if (p instanceof TrainerPrincipal tp) {
            return new UserContext(tp.userId(), "TRAINER");
        }
        if (p instanceof MemberPrincipal mp) {
            return new UserContext(mp.userId(), "MEMBER");
        }
        if (p instanceof AdminPrincipal ap) {
            return new UserContext(ap.userId(), "ADMIN");
        }
        throw new RuntimeException("Invalid principal");
    }

    @PostMapping("/mark")
    public ResponseEntity<?> markAttendance(@RequestParam(defaultValue = "PRESENT") String status,
            Authentication auth) {
        var ctx = extractUser(auth);
        AttendanceMarkResponse res = attendanceService.markToday(ctx.userId(), ctx.role, status);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/today")
    public ResponseEntity<?> checkToday(Authentication auth) {
        var ctx = extractUser(auth);
        return ResponseEntity.ok(attendanceService.getToday(ctx.userId()));
    }

    @GetMapping("/history")
    public ResponseEntity<?> history(Authentication auth) {
        var ctx = extractUser(auth);
        return ResponseEntity.ok(attendanceService.getHistory(ctx.userId()));
    }

    @GetMapping("/streak")
    public ResponseEntity<Integer> getStreak(Authentication auth) {
        var ctx = extractUser(auth);
        return ResponseEntity.ok(attendanceService.getStreak(ctx.userId()));
    }

    @GetMapping("/max-streak")
    public ResponseEntity<Integer> getMaxStreak(Authentication auth) {
        var ctx = extractUser(auth);
        return ResponseEntity.ok(attendanceService.getMaxStreak(ctx.userId()));
    }

    // ADMIN ENDPOINTS (use admin JWT)
    @GetMapping("/admin/user/{userId}")
    public ResponseEntity<?> adminUserHistory(@PathVariable Integer userId) {
        return ResponseEntity.ok(attendanceService.getHistory(userId));
    }

    @GetMapping("/admin/gym/{gymId}")
    public ResponseEntity<?> adminGymStats(@PathVariable Long gymId) {
        return ResponseEntity.ok(attendanceService.getGymAttendance(gymId));
    }
}
