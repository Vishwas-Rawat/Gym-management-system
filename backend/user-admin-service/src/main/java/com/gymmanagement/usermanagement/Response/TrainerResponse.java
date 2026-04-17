// src/main/java/com/gymmanagement/usermanagement/Response/TrainerResponse.java
package com.gymmanagement.usermanagement.Response;

import com.gymmanagement.commonservices.entity.Trainer;

import lombok.Data;

@Data
public class TrainerResponse {
    private Integer trainerId;
    private Integer userId; // Added for frontend sync
    private String fullName;
    private String email;
    private String phoneNo;
    private String specialization;
    private Integer experienceYears;
    private Double salary;
    private String gymName;

    public TrainerResponse(Trainer trainer) {
        this.trainerId = trainer.getTrainerId();
        this.userId = trainer.getUser().getUserId(); // Populate userId
        this.fullName = trainer.getUser().getUserProfile() != null
                ? trainer.getUser().getUserProfile().getFirstName() + " " +
                        (trainer.getUser().getUserProfile().getLastName() != null
                                ? trainer.getUser().getUserProfile().getLastName()
                                : "")
                : "Unknown";
        this.email = trainer.getUser().getEmail();
        this.phoneNo = trainer.getUser().getPhoneNumber();
        this.specialization = trainer.getSpecialization();
        this.experienceYears = trainer.getExperienceYears();
        this.salary = trainer.getSalary();
        this.gymName = trainer.getGym() != null ? trainer.getGym().getGymName() : "No Gym";
    }
}