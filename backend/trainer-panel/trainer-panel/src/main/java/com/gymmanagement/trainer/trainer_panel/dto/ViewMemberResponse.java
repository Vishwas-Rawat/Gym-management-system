package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ViewMemberResponse {

    private Integer memberId;
    private String fullName;
    private String email;
    private String phoneNo;
    private String membershipPlan;
    private Long gymId;
    private String timing;
    private Double totalPaid;
    private String paymentMethod;
    private Integer userId;
    private Integer trainerUserId;
    private String startDate; // Changed from joiningDate to match User Service
    private Boolean isActive; // Added for UI

}
