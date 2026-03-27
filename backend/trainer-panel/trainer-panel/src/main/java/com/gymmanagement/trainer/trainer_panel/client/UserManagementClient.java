package com.gymmanagement.trainer.trainer_panel.client;

import com.gymmanagement.trainer.trainer_panel.config.FeignAuthConfig;
import com.gymmanagement.trainer.trainer_panel.dto.UserProfileResponse;
import com.gymmanagement.trainer.trainer_panel.dto.UserResponse;
import com.gymmanagement.trainer.trainer_panel.dto.ViewMemberResponse;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "user-management", url = "http://localhost:8083", configuration = FeignAuthConfig.class)
public interface UserManagementClient {

        @GetMapping("/user/email/{email}")
        UserResponse getUserByEmail(@PathVariable String email);

        @GetMapping("/user/{userId}")
        UserResponse getUserById(@PathVariable Integer userId);

        @GetMapping("/user/profile/{userId}")
        UserProfileResponse getUserProfile(@PathVariable Integer userId);

        @GetMapping("/trainer/user/{userId}/id")
        Integer getTrainerIdByUserId(@PathVariable Integer userId);

        @GetMapping("/member/gym/{gymId}/trainer/{trainerId}/members")
        List<ViewMemberResponse> getMembersByTrainer(
                        @PathVariable Long gymId,
                        @PathVariable Integer trainerId);

        // ⭐ REQUIRED FOR MEMBER → MY DIET / MY WORKOUT
        @GetMapping("/member/user/{userId}")
        ViewMemberResponse getMemberByUserId(@PathVariable Integer userId);

        @GetMapping("/trainer/gym/{gymId}")
        List<Object> getTrainersByGym(@PathVariable Long gymId);

        @GetMapping("/user/search")
        List<UserResponse> searchUsers(@RequestParam("query") String query);
}
