package com.gymmanagement.usermanagement.controller;

import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.usermanagement.Request.AddMemberRequest;
import com.gymmanagement.usermanagement.Request.UpdateMemberRequest;
import com.gymmanagement.usermanagement.Response.AddMemberResponse;
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

    @PostMapping("/add")
    public ResponseEntity<AddMemberResponse> addMember(@RequestBody AddMemberRequest request) {
        try {
            Member member = memberService.addMember(request);

            // ✅ Construct full name using firstName + lastName
            String fullName = member.getUser().getFirstName() +
                    (member.getUser().getLastName() != null ? " " + member.getUser().getLastName() : "");

            return ResponseEntity.ok(
                new AddMemberResponse(
                    member.getMemberId(),
                    fullName.trim(),
                    member.getUser().getEmail(),
                    "Member added successfully"
                )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                new AddMemberResponse(null, null, null, e.getMessage())
            );
        }
    }

    @GetMapping("/{memberId}")
    public ResponseEntity<ViewMemberResponse> getMemberById(@PathVariable Integer memberId) {
        Member member = memberService.getMemberById(memberId);
        return ResponseEntity.ok(new ViewMemberResponse(member, "Member retrieved successfully"));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ViewMemberResponse> getMemberByUserId(@PathVariable Integer userId) {
        Member member = memberService.getMemberByUserId(userId);
        return ResponseEntity.ok(new ViewMemberResponse(member, "Member retrieved successfully"));
    }

    @GetMapping("/all")
    public List<ViewMemberResponse> getAllMembers() {
        return memberService.getAllMembers().stream()
                .map(member -> new ViewMemberResponse(member, "Member retrieved successfully"))
                .collect(Collectors.toList());
    }

    @PutMapping("/{memberId}")
    public ResponseEntity<UpdateMemberResponse> updateMember(@PathVariable Integer memberId,
                                                             @RequestBody UpdateMemberRequest request) {
        try {
            Member member = memberService.updateMember(memberId, request);
            return ResponseEntity.ok(new UpdateMemberResponse(member, "Member updated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new UpdateMemberResponse(null, e.getMessage()));
        }
    }

    @DeleteMapping("/{memberId}")
    public ResponseEntity<String> deleteMember(@PathVariable Integer memberId) {
        try {
            memberService.deleteMember(memberId);
            return ResponseEntity.ok("Member deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @GetMapping("/search")
    public List<ViewMemberResponse> searchMembers(@RequestParam String keyword) {
        return memberService.searchMembers(keyword).stream()
                .map(member -> new ViewMemberResponse(member, "Member retrieved successfully"))
                .collect(Collectors.toList());
    }
}
