package com.gymmanagement.trainer.trainer_panel.controller;

import com.gymmanagement.trainer.trainer_panel.dto.AttendanceMarkResponse;
import com.gymmanagement.trainer.trainer_panel.security.MemberPrincipal;
import com.gymmanagement.trainer.trainer_panel.security.TrainerPrincipal;
import com.gymmanagement.trainer.trainer_panel.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/attendance")
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
        if (p instanceof com.gymmanagement.trainer.trainer_panel.security.AdminPrincipal ap) { // ✅ NEW
            return new UserContext(ap.userId(), "ADMIN");
        }
        throw new RuntimeException("Invalid principal: " + p.getClass().getName());
    }

    @PostMapping("/mark")
    public ResponseEntity<?> markAttendance(Authentication auth) {
        System.out.println("DEBUG: markAttendance called. Principal: " + auth.getPrincipal());
        var ctx = extractUser(auth);
        System.out.println("DEBUG: Extracted User: " + ctx);
        AttendanceMarkResponse res = attendanceService.markToday(ctx.userId(), ctx.role);
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

    // ADMIN ENDPOINTS (use admin JWT)
    @GetMapping("/admin/user/{userId}")
    public ResponseEntity<?> adminUserHistory(@PathVariable Integer userId) {
        return ResponseEntity.ok(attendanceService.getHistory(userId));
    }

    @GetMapping("/admin/gym/{gymId}")
    public ResponseEntity<?> adminGymStats(
            @PathVariable Long gymId,
            @RequestParam(required = false, defaultValue = "date") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String direction,
            @RequestParam(required = false) java.time.LocalDate date,
            Authentication auth) {
        var ctx = extractUser(auth);
        Integer adminId = "ADMIN".equals(ctx.role) ? ctx.userId : null;
        return ResponseEntity.ok(attendanceService.getGymAttendance(gymId, sortBy, direction, date, adminId));
    }

    @PostMapping("/admin/update")
    public ResponseEntity<?> adminUpdateAttendance(
            @RequestBody com.gymmanagement.trainer.trainer_panel.dto.AdminAttendanceUpdateRequest req) {
        attendanceService.updateAttendance(req.getUserId(), req.getDate(), req.getStatus());
        return ResponseEntity.ok(java.util.Map.of("message", "Attendance updated successfully"));
    }
}
