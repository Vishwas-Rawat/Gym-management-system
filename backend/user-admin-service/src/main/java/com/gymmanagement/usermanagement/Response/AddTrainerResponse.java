// src/main/java/com/gymmanagement/usermanagement/Response/AddTrainerResponse.java
package com.gymmanagement.usermanagement.Response;

import com.gymmanagement.commonservices.entity.Trainer;
import lombok.Data;

@Data
public class AddTrainerResponse {
    private Integer trainerId;
    private Integer userId;
    private String fullName;
    private String email;
    private String phoneNo;
    private String specialization;
    private String message;

    public AddTrainerResponse(Trainer trainer, String message) {
        this.trainerId = trainer.getTrainerId();
        this.userId = trainer.getUser().getUserId();
        this.fullName = trainer.getUser().getUserProfile() != null 
            ? trainer.getUser().getUserProfile().getFirstName() + " " +
              (trainer.getUser().getUserProfile().getLastName() != null ? trainer.getUser().getUserProfile().getLastName() : "")
            : "Trainer";
        this.email = trainer.getUser().getEmail();
        this.phoneNo = trainer.getUser().getPhoneNumber();
        this.specialization = trainer.getSpecialization();
        this.message = message;
    }
}