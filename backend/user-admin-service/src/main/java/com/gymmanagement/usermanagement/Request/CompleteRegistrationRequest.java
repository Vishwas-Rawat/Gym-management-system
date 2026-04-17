package com.gymmanagement.usermanagement.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CompleteRegistrationRequest {
    private String token; // from email link
    
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$", 
             message = "Password must be at least 8 characters long and include: one uppercase letter, one lowercase letter, one digit, and one special character (e.g. @, #, $, %)")
    private String password;
    private Integer age; // optional
    private LocalDate dateOfBirth; // optional
    private String gender; // optional
    private String fitnessGoal; // optional
    private String workoutTimeSlot; // optional
    private String username;
}
