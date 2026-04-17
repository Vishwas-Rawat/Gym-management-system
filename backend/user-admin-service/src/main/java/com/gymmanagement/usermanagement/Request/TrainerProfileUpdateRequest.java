package com.gymmanagement.usermanagement.Request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TrainerProfileUpdateRequest {
    // Professional Info
    private String specialization;
    private Integer experienceYears;
    private String availability;
    
    // Personal Info (UserProfile)
    private String firstName;
    private String lastName;
    private String gender;
    private LocalDate dateOfBirth;
    private String phoneNo;
}
