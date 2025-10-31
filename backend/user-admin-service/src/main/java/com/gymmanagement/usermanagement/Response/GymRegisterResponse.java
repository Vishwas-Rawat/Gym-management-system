package com.gymmanagement.usermanagement.Response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
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

    private Integer adminId;
    private String message;

    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}