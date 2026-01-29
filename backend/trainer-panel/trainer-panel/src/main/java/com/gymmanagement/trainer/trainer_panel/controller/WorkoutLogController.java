package com.gymmanagement.trainer.trainer_panel.controller;

import com.gymmanagement.commonservices.entity.MemberWorkoutLog;
import com.gymmanagement.trainer.trainer_panel.dto.LogWorkoutRequest;
import com.gymmanagement.trainer.trainer_panel.security.MemberPrincipal;
import com.gymmanagement.trainer.trainer_panel.service.WorkoutLogService;
import com.gymmanagement.trainer.trainer_panel.repository.MemberRepository;
import com.gymmanagement.commonservices.entity.Member;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/workout/log")
@RequiredArgsConstructor
public class WorkoutLogController {

    private final WorkoutLogService service;
    private final MemberRepository memberRepo;

    private Integer getMemberId(Authentication auth) {
        if (auth.getPrincipal() instanceof MemberPrincipal mp) {
            Member member = memberRepo.findByUser_UserId(mp.userId())
                    .orElseThrow(() -> new IllegalArgumentException("Member not found"));
            return member.getMemberId();
        }
        throw new RuntimeException("Not authorized as Member");
    }

    @PostMapping
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<?> logWorkout(@RequestBody List<LogWorkoutRequest> reqs, Authentication auth) {
        Integer memberId = getMemberId(auth);
        return ResponseEntity.ok(service.logWorkouts(memberId, reqs));
    }

    @GetMapping
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<List<MemberWorkoutLog>> getDailyLog(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Authentication auth) {
        Integer memberId = getMemberId(auth);
        return ResponseEntity.ok(service.getDailyLog(memberId, date));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<?> deleteLog(@PathVariable Long id, Authentication auth) {
        Integer memberId = getMemberId(auth);
        service.deleteLog(memberId, id);
        return ResponseEntity.ok("Log deleted successfully");
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<?> updateLog(@PathVariable Long id, @RequestBody LogWorkoutRequest req, Authentication auth) {
        Integer memberId = getMemberId(auth);
        return ResponseEntity.ok(service.updateLog(memberId, id, req));
    }
}
