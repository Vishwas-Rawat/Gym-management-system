package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;

/**
 * DTO representing member view information.
 */
@Data
@AllArgsConstructor
public class ViewMemberResponse {
    private Integer memberId;
    private String firstName;
    private String phoneNumber;
    private String email;
    private String phoneNo;
    private String fitnessGoal;
    private String membershipPlan;
    private Long gymId;
    private String timing;
    private LocalDate dateOfBirth;
    private String address;
    private String gender;
    private String paymentMethod;
    private Integer userId;
    private Integer trainerId; // Added for has-trainer check
}
