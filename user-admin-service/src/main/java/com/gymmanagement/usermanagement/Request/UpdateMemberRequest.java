package com.gymmanagement.usermanagement.Request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateMemberRequest {
    private String name;
    private String email;
    private String gender;
    private String fitnessGoal;
    private String membershipPlan;
    private LocalDate joiningDate;
    private Double amountPaid;
    private String paymentMethod;
    private String workoutTimeSlot;
}