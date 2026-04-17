package com.gymmanagement.usermanagement.Response;

import lombok.Data;

@Data
public class LoginResponse {
    private Integer userId;
    private String email;
    private String message;
    private String token; // Access Token
    private String refreshToken;

    public LoginResponse(Integer userId, String email, String message) {
        this.userId = userId;
        this.email = email;
        this.message = message;
    }
    
    // Constructor with both tokens
    public LoginResponse(Integer userId, String email, String token, String refreshToken, String message) {
        this.userId = userId;
        this.email = email;
        this.token = token;
        this.refreshToken = refreshToken;
        this.message = message;
    }
}
