package com.gymmanagement.usermanagement.Request;

import lombok.Data;

@Data
public class CompleteRegistrationRequest {
    private String token;             // token from invite link
    private String password;          // new password
    private Integer age;
    private String gender;
    private String fitnessGoal;
    private String workoutTimeSlot;   // optional override
    private String dateOfBirth;
}