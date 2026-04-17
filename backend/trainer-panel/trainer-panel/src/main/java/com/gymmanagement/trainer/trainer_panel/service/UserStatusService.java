package com.gymmanagement.trainer.trainer_panel.service;

import com.gymmanagement.trainer.trainer_panel.client.UserManagementClient;
import com.gymmanagement.trainer.trainer_panel.dto.UserResponse;
import com.gymmanagement.trainer.trainer_panel.dto.UserStatusResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserStatusService {

    private final UserManagementClient userClient;

    public UserStatusResponse checkStatus(Integer userId) {

        UserResponse user = userClient.getUserById(userId);   // ✅ FIXED

        if (user == null) {
            return new UserStatusResponse(false, "User not found");
        }

        if (Boolean.FALSE.equals(user.getIsActive())) {
            return new UserStatusResponse(false, "You are inactive. Contact admin.");
        }

        return new UserStatusResponse(true, "Active");
    }
}
