package com.gymmanagement.usermanagement.Request;

import java.time.LocalDate;
import lombok.Data;

@Data
public class AdminAddMemberRequest {
	private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String membershipPlan;
    private LocalDate joiningDate;
    private Double amountPaid;
    private String paymentMethod;
    private String workoutTimeSlot;
    private Integer gymId;
}
