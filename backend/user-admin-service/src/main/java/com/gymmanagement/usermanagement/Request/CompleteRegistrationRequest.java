package com.gymmanagement.usermanagement.Request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CompleteRegistrationRequest {
    private String token; // from email link
    private String password;
    private Integer age; // optional
    private LocalDate dateOfBirth; // optional
    private String gender; // optional
    private String fitnessGoal; // optional
    private String workoutTimeSlot; // optional
    private String username;
}
