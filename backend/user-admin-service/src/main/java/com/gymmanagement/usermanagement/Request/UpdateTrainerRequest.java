package com.gymmanagement.usermanagement.Request;

import lombok.Data;

@Data
public class UpdateTrainerRequest {
    private String specialization;
    private Integer experienceYears;
    private String availability;
    private String phoneNo;
    private Double salary;
    private String status;
    private Long gymId; // Support Gym Transfer
}