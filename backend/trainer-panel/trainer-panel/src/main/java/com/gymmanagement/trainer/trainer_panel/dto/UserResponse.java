package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Data;

/**
 * DTO representing basic user information.
 */
@Data
public class UserResponse {
    private Integer userId;
    private String firstName;
    private String lastName;
    private String email;
    private Long gymId; // 🔥 add gymId for trainer dashboard
    private Boolean isActive; // ✅ REQUIRED for inactive-blocking
    private String role; // optional but often required
    private String phoneNumber; // added phone number field
}
