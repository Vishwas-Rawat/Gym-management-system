package com.gymmanagement.usermanagement.Request;

import lombok.Data;

@Data
public class GymRegisterRequest {
    private String gymName;
    private String address;
    private String city;
    private String state;
    private String contactNumber;
    private String email;
    private String openingHours;
}
