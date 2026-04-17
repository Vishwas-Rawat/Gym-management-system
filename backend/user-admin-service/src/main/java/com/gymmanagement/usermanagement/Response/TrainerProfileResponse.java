package com.gymmanagement.usermanagement.Response;

import com.gymmanagement.commonservices.entity.Trainer;
import com.gymmanagement.commonservices.entity.UserProfile;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class TrainerProfileResponse {
    private Integer trainerId;
    private Integer userId;
    private String fullName;
    private String email;
    private String phoneNo;
    private String specialization;
    private Integer experienceYears;
    private String availability;
    private Double salary;
    private String status;
    private String gymName;
    
    // User Profile Fields
    private String firstName;
    private String lastName;
    private String gender;
    private LocalDate dateOfBirth;

    public TrainerProfileResponse(Trainer t) {
        this.trainerId = t.getTrainerId();
        this.userId = t.getUser() != null ? t.getUser().getUserId() : null;
        this.fullName = t.getFullName();
        this.email = t.getEmail();
        this.phoneNo = t.getPhoneNo();
        this.specialization = t.getSpecialization();
        this.experienceYears = t.getExperienceYears();
        this.availability = t.getAvailability();
        this.salary = t.getSalary();
        this.status = t.getStatus();
        this.gymName = t.getGym() != null ? t.getGym().getGymName() : null;

        if (t.getUser() != null && t.getUser().getUserProfile() != null) {
            UserProfile up = t.getUser().getUserProfile();
            this.firstName = up.getFirstName();
            this.lastName = up.getLastName();
            this.gender = up.getGender();
            this.dateOfBirth = up.getDateOfBirth();
        }
    }
}
