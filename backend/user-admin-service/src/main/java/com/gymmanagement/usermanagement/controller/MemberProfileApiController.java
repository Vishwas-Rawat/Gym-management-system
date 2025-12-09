package com.gymmanagement.usermanagement.controller;

import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.commonservices.entity.User;
import com.gymmanagement.commonservices.entity.UserProfile;
import com.gymmanagement.usermanagement.repository.MemberRepository;
import com.gymmanagement.usermanagement.repository.UserProfileRepository;
import com.gymmanagement.usermanagement.repository.UserRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/member/profile")
@RequiredArgsConstructor
public class MemberProfileApiController {

    private final UserRepository userRepo;
    private final UserProfileRepository profileRepo;
    private final MemberRepository memberRepo;

    @GetMapping("/me")
    public ResponseEntity<MemberProfileResponse> getMyProfile(Authentication auth) {
        String email = auth.getName();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = profileRepo.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        Member member = memberRepo.findByUser_UserId(user.getUserId())
                .orElse(null);

        return ResponseEntity.ok(MemberProfileResponse.builder()
                .userId(user.getUserId())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .email(user.getEmail())
                .phone(user.getPhoneNumber())
                .dateOfBirth(profile.getDateOfBirth())
                .gender(profile.getGender())
                .address(profile.getAddress())
                .weight(profile.getWeight())
                .height(profile.getHeight())
                .fitnessGoal(member != null ? member.getFitnessGoal() : null)
                .membershipPlan(member != null ? member.getMembershipPlan() : null)
                .build());
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(Authentication auth, @RequestBody UpdateMemberProfileRequest req) {
        String email = auth.getName();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfile profile = profileRepo.findByUser_UserId(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        Member member = memberRepo.findByUser_UserId(user.getUserId())
                .orElse(null);

        if (req.getWeight() != null)
            profile.setWeight(req.getWeight());
        if (req.getHeight() != null)
            profile.setHeight(req.getHeight());
        if (req.getAddress() != null)
            profile.setAddress(req.getAddress());
        if (req.getFirstName() != null)
            profile.setFirstName(req.getFirstName());
        if (req.getLastName() != null)
            profile.setLastName(req.getLastName());

        profileRepo.save(profile);

        if (member != null && req.getFitnessGoal() != null) {
            member.setFitnessGoal(req.getFitnessGoal());
            memberRepo.save(member);
        }

        return ResponseEntity.ok("Profile updated");
    }

    @Data
    @Builder
    public static class MemberProfileResponse {
        private Integer userId;
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private LocalDate dateOfBirth;
        private String gender;
        private String address;
        private Double weight;
        private Double height;
        private String fitnessGoal;
        private String membershipPlan;
    }

    @Data
    public static class UpdateMemberProfileRequest {
        private String firstName;
        private String lastName;
        private String address;
        private Double weight;
        private Double height;
        private String fitnessGoal;
    }
}
