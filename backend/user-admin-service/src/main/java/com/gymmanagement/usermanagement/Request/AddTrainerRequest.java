// src/main/java/com/gymmanagement/usermanagement/Request/AddTrainerRequest.java
package com.gymmanagement.usermanagement.Request;

import lombok.Data;

@Data
public class AddTrainerRequest {
    private String fullName;
    private String email;
    private String phoneNo;
    private String specialization;
    private Integer experienceYears;
    private Integer gymId;
}