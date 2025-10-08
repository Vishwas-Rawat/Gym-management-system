package com.gymmanagement.usermanagement.Request;

import java.time.LocalDate;
import lombok.Data;

@Data
public class AddMemberRequest {
    private Integer userId;          // Link to User table
    private String fitnessGoal;
    private String membershipPlan;   // monthly, quarterly, annual
    private LocalDate joiningDate;
    private Double amountPaid;
    private String paymentMethod;
    private String workoutTimeSlot;
}
