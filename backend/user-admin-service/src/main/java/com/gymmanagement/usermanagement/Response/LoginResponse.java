package com.gymmanagement.usermanagement.Response;

import lombok.Data;

@Data
public class LoginResponse {
    private Integer userId;
    private String email;
    private String message;
    private String token;

    public LoginResponse(Integer userId, String email, String message) {
        this.userId = userId;
        this.email = email;
        this.message = message;
    }
    
 // Constructor with token
    public LoginResponse(Integer userId, String email, String token, String message) {
        this.userId = userId;
        this.email = email;
        this.token = token;
        this.message = message;
    }
}
