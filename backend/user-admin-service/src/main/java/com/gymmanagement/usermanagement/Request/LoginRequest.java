package com.gymmanagement.usermanagement.Request;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String username;
    private String password;

    public String getIdentifier() {
        return email != null && !email.trim().isEmpty() ? email : username;
    }
}