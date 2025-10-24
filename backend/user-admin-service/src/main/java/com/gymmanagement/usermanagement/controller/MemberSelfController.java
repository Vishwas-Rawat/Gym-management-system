package com.gymmanagement.usermanagement.controller;

import com.gymmanagement.usermanagement.Request.CompleteRegistrationRequest;
import com.gymmanagement.usermanagement.Response.ApiResponse;
import com.gymmanagement.usermanagement.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/member-self") // ✅ Changed base path to avoid conflict
public class MemberSelfController {

    private final MemberService memberService;

    public MemberSelfController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping("/complete-registration")
    public ResponseEntity<ApiResponse> completeRegistration(@RequestBody CompleteRegistrationRequest request) {
        try {
            memberService.completeRegistration(request);
            return ResponseEntity.ok(new ApiResponse(true, "Registration completed successfully"));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, ex.getMessage()));
        }
    }
}
