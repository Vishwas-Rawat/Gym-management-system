package com.gymmanagement.usermanagement.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterResponse {
    private String status;   // "success" or "error"
    private String message;  // description
    private Integer userId;  // optional, can be null
    private String email;    // optional, can be null
}
