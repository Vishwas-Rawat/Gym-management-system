package com.gymmanagement.usermanagement.Response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GymRegisterResponse {
    private Long gymId;
    private String gymName;
    private String address;
    private String city;
    private String state;
    private String contactNumber;
    private String email;
    private String openingHours;
    private Integer adminId;  // ✅ only admin ID
    private String message;
}
