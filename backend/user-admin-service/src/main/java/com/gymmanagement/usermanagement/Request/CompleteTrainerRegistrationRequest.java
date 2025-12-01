// src/main/java/com/gymmanagement/usermanagement/Request/CompleteTrainerRegistrationRequest.java
package com.gymmanagement.usermanagement.Request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CompleteTrainerRegistrationRequest {
    private String token;
    private String password;
    private String username;        // COMPULSORY
    private LocalDate dateOfBirth;
    private String gender;
}