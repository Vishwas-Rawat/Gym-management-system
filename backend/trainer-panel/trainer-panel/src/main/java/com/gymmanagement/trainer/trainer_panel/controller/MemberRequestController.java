package com.gymmanagement.trainer.trainer_panel.controller;

import com.gymmanagement.trainer.trainer_panel.dto.RequestCreateDto;
import com.gymmanagement.trainer.trainer_panel.dto.RequestResponse;
import com.gymmanagement.trainer.trainer_panel.service.RequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gymmanagement.trainer.trainer_panel.security.MemberPrincipal;
import com.gymmanagement.trainer.trainer_panel.repository.MemberRepository;
import com.gymmanagement.commonservices.entity.Member;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/member/request")
@RequiredArgsConstructor
public class MemberRequestController {

    private final RequestService requestService;
    private final MemberRepository memberRepo;

    // Member posts diet request
    @PostMapping("/diet")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<RequestResponse> requestDiet(@RequestBody RequestCreateDto dto, Authentication auth) {
        dto.setMemberId(getMemberId(auth));
        return ResponseEntity.ok(requestService.createDietRequest(dto));
    }

    // Member posts workout request
    @PostMapping("/workout")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<RequestResponse> requestWorkout(@RequestBody RequestCreateDto dto, Authentication auth) {
        dto.setMemberId(getMemberId(auth));
        return ResponseEntity.ok(requestService.createWorkoutRequest(dto));
    }

    private Integer getMemberId(Authentication auth) {
        Object principal = auth.getPrincipal();
        if (principal instanceof MemberPrincipal mp) {
            return memberRepo.findByUser_UserId(mp.userId())
                    .orElseThrow(() -> new IllegalArgumentException("Member not found"))
                    .getMemberId();
        }
        throw new RuntimeException("Not authorized as member");
    }
}
