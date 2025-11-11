package com.gymmanagement.usermanagement.controller;

import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.usermanagement.Request.AdminAddMemberRequest;
import com.gymmanagement.usermanagement.Request.CompleteRegistrationRequest;
import com.gymmanagement.usermanagement.Request.UpdateMemberRequest;
import com.gymmanagement.usermanagement.Response.AddMemberResponse;
import com.gymmanagement.usermanagement.Response.ApiResponse;
import com.gymmanagement.usermanagement.Response.GymMemberResponse;
import com.gymmanagement.usermanagement.Response.UpdateMemberResponse;
import com.gymmanagement.usermanagement.Response.ViewMemberResponse;
import com.gymmanagement.usermanagement.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/member")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    // Admin adds member → generates invite link
    @PostMapping("/admin/add-multiple")
    public ResponseEntity<ApiResponse> addMultipleMembersByAdmin(@RequestBody List<AdminAddMemberRequest> requests) {
        try {
            List<AddMemberResponse> responses = memberService.addMultipleMembersByAdmin(requests);
            return ResponseEntity.ok(new ApiResponse(true,
                    responses.size() + " members added successfully and registration links sent"));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, ex.getMessage()));
        }
    }





    // Admin resends registration link
    @PostMapping("/admin/{userId}/resend-invite")
    public ResponseEntity<ApiResponse> resendInvite(@PathVariable Integer userId) {
        try {
            memberService.resendRegistrationLink(userId);
            return ResponseEntity.ok(new ApiResponse(true, "Registration link resent successfully"));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, ex.getMessage()));
        }
    }

    // Member completes registration
    @PostMapping("/complete-registration")
    public ResponseEntity<ApiResponse> completeRegistration(@RequestBody CompleteRegistrationRequest request) {
        try {
            memberService.completeRegistration(request);
            return ResponseEntity.ok(new ApiResponse(true, "Registration completed successfully"));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, ex.getMessage()));
        }
    }

    // Get member by ID
    @GetMapping("/{memberId}")
    public ResponseEntity<ViewMemberResponse> getMemberById(@PathVariable Integer memberId) {
        Member member = memberService.getMemberById(memberId);
        return ResponseEntity.ok(new ViewMemberResponse(member, "Member retrieved successfully"));
    }

    // Get member by User ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<ViewMemberResponse> getMemberByUserId(@PathVariable Integer userId) {
        Member member = memberService.getMemberByUserId(userId);
        return ResponseEntity.ok(new ViewMemberResponse(member, "Member retrieved successfully"));
    }

    // Get all members
    @GetMapping("/all")
    public List<ViewMemberResponse> getAllMembers() {
        return memberService.getAllMembers().stream()
                .map(member -> new ViewMemberResponse(member, "Member retrieved successfully"))
                .collect(Collectors.toList());
    }

    // Update member details
    @PutMapping("/{memberId}")
    public ResponseEntity<UpdateMemberResponse> updateMember(@PathVariable Integer memberId,
                                                             @RequestBody UpdateMemberRequest request) {
        try {
            Member member = memberService.updateMember(memberId, request);
            return ResponseEntity.ok(new UpdateMemberResponse(member, "Member updated successfully"));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(new UpdateMemberResponse(null, ex.getMessage()));
        }
    }

    // Delete member
    @DeleteMapping("/{memberId}")
    public ResponseEntity<ApiResponse> deleteMember(@PathVariable Integer memberId) {
        try {
            memberService.deleteMember(memberId);
            return ResponseEntity.ok(new ApiResponse(true, "Member deleted successfully (soft delete)"));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, ex.getMessage()));
        }
    }

    // Search members by keyword (membership plan)
    @GetMapping("/search")
    public List<ViewMemberResponse> searchMembers(@RequestParam String keyword) {
        return memberService.searchMembers(keyword).stream()
                .map(member -> new ViewMemberResponse(member, "Member retrieved successfully"))
                .collect(Collectors.toList());
    }
    
 // Get all members for a specific gym
    @GetMapping("/gym/{gymId}")
    public ResponseEntity<List<GymMemberResponse>> getMembersByGym(@PathVariable Long gymId) {
        List<GymMemberResponse> responses = memberService.getMembersByGymId(gymId).stream()
                .map(GymMemberResponse::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

}
