package com.gymmanagement.trainer.trainer_panel.controller;

import com.gymmanagement.trainer.trainer_panel.dto.RequestCreateDto;
import com.gymmanagement.trainer.trainer_panel.dto.RequestResponse;
import com.gymmanagement.trainer.trainer_panel.service.RequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/member/request")
@RequiredArgsConstructor
public class MemberRequestController {

    private final RequestService requestService;

    // Member posts diet request
    @PostMapping("/diet")
    public ResponseEntity<RequestResponse> requestDiet(@RequestBody RequestCreateDto dto) {
        return ResponseEntity.ok(requestService.createDietRequest(dto));
    }

    // Member posts workout request
    @PostMapping("/workout")
    public ResponseEntity<RequestResponse> requestWorkout(@RequestBody RequestCreateDto dto) {
        return ResponseEntity.ok(requestService.createWorkoutRequest(dto));
    }
}
