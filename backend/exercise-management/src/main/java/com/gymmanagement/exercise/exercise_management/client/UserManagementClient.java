package com.gymmanagement.exercise.exercise_management.client;

import java.util.List;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import com.gymmanagement.exercise.exercise_management.config.FeignClientConfig;
import com.gymmanagement.exercise.exercise_management.dto.MemberDto;

import lombok.Data;

@FeignClient(
        name = "user-management",
        url = "http://localhost:8083",
        configuration = FeignClientConfig.class
)
public interface UserManagementClient {

    @GetMapping("/user/{id}")
    UserResponse getUserById(@PathVariable("id") Integer id);

    @GetMapping("/user/email/{email}")
    UserResponse getUserByEmail(@PathVariable("email") String email);

    /**
     * Returns active member entry (from members table) — throws if not found.
     */
    @GetMapping("/member/active/{id}")
    MemberResponse getActiveMemberById(@PathVariable("id") Integer id);

    /**
     * Returns member by user id (if you have explicit endpoint). Kept for completeness;
     * your user-management service already exposes /member/user/{userId} optionally.
     */
    @GetMapping("/member/user/{userId}")
    MemberResponse getMemberByUserId(@PathVariable("userId") Integer userId);

    @GetMapping("/trainer/{trainerId}/members")
    List<MemberDto> getMembersByTrainer(@PathVariable("trainerId") Integer trainerId);

    @Data
    class UserResponse {
        private Integer userId;
        private String firstName;
        private String lastName;
        private String email;
    }

    @Data
    class MemberResponse {
        private Integer memberId;
        private UserResponse user;
        private Integer trainerId;
        private String membershipPlan;
    }
}
