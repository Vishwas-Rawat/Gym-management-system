package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Data;
import java.time.LocalDate;

/**
 * DTO representing a user's profile details.
 */
@Data
public class UserProfileResponse {
    private Integer userId;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private Double weight;
    private Double height;
    private String address;
    private String gender;
    private String phoneNumber;
    private Boolean isActive;
    private String role;
}
