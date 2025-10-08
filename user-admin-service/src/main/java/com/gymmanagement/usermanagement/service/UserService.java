package com.gymmanagement.usermanagement.service;

import com.gymmanagement.usermanagement.Request.RegisterRequest;
import com.gymmanagement.usermanagement.Response.LoginResponse;
import com.gymmanagement.usermanagement.Response.RegisterResponse;

public interface UserService {
    RegisterResponse registerUser(RegisterRequest request);
    String verifyOtp(Integer userId, String otpCode);
    String resendOtp(Integer userId);
    LoginResponse login(String email, String password);
}
