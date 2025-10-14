package com.gymmanagement.usermanagement.Request;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
