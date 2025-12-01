// src/main/java/com/gymmanagement/trainer/trainer_panel/dto/UserResponse.java
package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Data;

@Data
public class UserResponse {
    private Integer userId;
    private String firstName;
    private String lastName;
    private String email;
}
