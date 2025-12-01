package com.gymmanagement.usermanagement.controller;

import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.usermanagement.Request.AdminAddMemberRequest;
import com.gymmanagement.usermanagement.Request.CompleteRegistrationRequest;
import com.gymmanagement.usermanagement.Request.UpdateMemberRequest;
import com.gymmanagement.usermanagement.Response.AddMemberResponse;
import com.gymmanagement.usermanagement.Response.ApiResponse;
import com.gymmanagement.usermanagement.Response.GymMemberResponse;
import com.gymmanagement.usermanagement.Response.MemberWithExpiryResponse;
import com.gymmanagement.usermanagement.Response.UpdateMemberResponse;
import com.gymmanagement.usermanagement.Response.ViewMemberResponse;
import com.gymmanagement.usermanagement.repository.MemberRepository;
import com.gymmanagement.usermanagement.service.MemberService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/member")
public class MemberController {

    private final MemberService memberService;
    
    private final MemberRepository memberRepository;

    public MemberController(MemberService memberService, MemberRepository memberRepository) {
        this.memberService = memberService;
        this.memberRepository = memberRepository;
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
    
 // 1. Get all members under a trainer (gym-specific)
    @GetMapping("/gym/{gymId}/trainer/{trainerId}/members")
    public ResponseEntity<List<ViewMemberResponse>> getMembersByTrainer(
            @PathVariable Long gymId,
            @PathVariable Integer trainerId) {

        List<ViewMemberResponse> members = memberService.getMembersByTrainerAndGym(trainerId, gymId)
                .stream()
                .map(m -> new ViewMemberResponse(m, "Member retrieved successfully"))
                .toList();

        return ResponseEntity.ok(members);
    }

    // 2. Remove member from trainer (gym-specific)
    @PostMapping("/gym/{gymId}/member/{memberId}/remove-trainer")
    public ResponseEntity<ApiResponse> removeMemberFromTrainer(
            @PathVariable Long gymId,
            @PathVariable Integer memberId) {
        try {
            memberService.removeMemberFromTrainer(memberId, gymId);
            return ResponseEntity.ok(new ApiResponse(true, "Member removed from trainer successfully"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, ex.getMessage()));
        }
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all-with-expiry")
    public ResponseEntity<List<MemberWithExpiryResponse>> getAllMembersWithExpiry() {
        return ResponseEntity.ok(memberService.getAllMembersWithExpiry());
    }
    
    
 // Send reminder to ONE member (perfect for frontend button click)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/send-reminder/{memberId}")
    public ResponseEntity<ApiResponse> sendSingleReminder(@PathVariable Integer memberId) {
        try {
            Member member = memberRepository.findActiveById(memberId)
                    .orElseThrow(() -> new IllegalArgumentException("Member not found"));

            long daysRemaining = ChronoUnit.DAYS.between(LocalDate.now(), calculateExpiryDate(member));

            if (daysRemaining > 10) {
                return ResponseEntity.ok(new ApiResponse(true,
                    "No reminder sent — membership is still active (" + daysRemaining + " days remaining)"));
            }

            memberService.sendSingleExpiryReminder(memberId);
            return ResponseEntity.ok(new ApiResponse(true, 
                    "Reminder email sent successfully (" + (daysRemaining < 0 ? "expired" : daysRemaining + " days left") + ")"));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // Send reminders to ALL expiring/expired members
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin/send-all-reminders")
    public ResponseEntity<ApiResponse> sendAllReminders() {
        try {
            int totalSent = memberService.sendAllExpiryReminders();
            int totalMembers = memberRepository.findAllActive().size();
            int greenMembers = totalMembers - totalSent;

            if (totalSent == 0) {
                return ResponseEntity.ok(new ApiResponse(true, 
                    "No reminders sent — all " + totalMembers + " members have more than 10 days remaining"));
            }

            return ResponseEntity.ok(new ApiResponse(true,
                    "Sent " + totalSent + " reminder emails. " + greenMembers + " members are safe (GREEN)"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    private LocalDate calculateExpiryDate(Member member) {
        LocalDate startDate = member.getPlanStartDate() != null 
                ? member.getPlanStartDate() 
                : member.getJoiningDate();

        int totalMonths = member.getMonthsPaid() 
                        + (member.getMonthsFree() != null ? member.getMonthsFree() : 0);

        return startDate.plusMonths(totalMonths).minusDays(1);
    }
    
 // =========================
 // GET ACTIVE MEMBER (For Feign Client)
 // =========================
 @GetMapping("/active/{memberId}")
 public ResponseEntity<ViewMemberResponse> getActiveMember(@PathVariable Integer memberId) {
     Member member = memberRepository.findActiveById(memberId)
             .orElseThrow(() -> new RuntimeException("Active member not found"));

     return ResponseEntity.ok(new ViewMemberResponse(member, "Active member retrieved successfully"));
 }

}
