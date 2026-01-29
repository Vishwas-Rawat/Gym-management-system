// src/main/java/com/gymmanagement/usermanagement/Request/AdminAddMemberRequest.java
package com.gymmanagement.usermanagement.Request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AdminAddMemberRequest {

    private String fullName;
    private String email;
    private String phoneNo;
    private Integer monthsPaid;
    private Integer monthsFree;

    private String workoutTimeSlot;

    private Double registrationFee;
    private Double planPrice;
    private Double discount;
    private String paymentMethod;
    private LocalDate joiningDate;
    private Integer gymId;
}