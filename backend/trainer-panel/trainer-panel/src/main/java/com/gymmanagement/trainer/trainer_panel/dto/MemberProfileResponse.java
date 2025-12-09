package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

/**
 * DTO that mirrors the response built in
 * {@link com.gymmanagement.trainer.trainer_panel.controller.MemberApiController}
 * and the inner static class used in the user‑admin service controller.
 */
@Data
@Builder
public class MemberProfileResponse {
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
