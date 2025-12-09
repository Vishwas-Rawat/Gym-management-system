package com.gymmanagement.usermanagement.Request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateMemberRequest {
    private String fullName;
    private String email;
    private String phoneNo;

    private Integer monthsPaid;
    private Integer monthsFree;

    // Timing fields (String to allow "1", "12", etc.)
    private String fromHour;
    private String fromMinute;
    private String fromPeriod; // AM/PM
    private String toHour;
    private String toMinute;
    private String toPeriod;

    private Double registrationFee;
    private Double planPrice;
    private Double discount;

    private String paymentMethod;
    private LocalDate joiningDate;

    // Support Gym Transfer
    private Long gymId;
}