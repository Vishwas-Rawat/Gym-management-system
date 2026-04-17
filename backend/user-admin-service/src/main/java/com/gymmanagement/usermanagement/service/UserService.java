package com.gymmanagement.usermanagement.service;

import com.gymmanagement.usermanagement.Request.ForgotPasswordRequest;
import com.gymmanagement.usermanagement.Request.RegisterRequest;
import com.gymmanagement.usermanagement.Request.ResetPasswordRequest;
import com.gymmanagement.usermanagement.Response.LoginResponse;
import com.gymmanagement.usermanagement.Response.RegisterResponse;

public interface UserService {
    RegisterResponse registerUser(RegisterRequest request);

    RegisterResponse verifyOtp(Integer userId, String otpCode);

    RegisterResponse resendOtp(Integer userId);

    LoginResponse login(String email, String password);

    RegisterResponse forgotPassword(ForgotPasswordRequest request);

    RegisterResponse resetPassword(ResetPasswordRequest request);

    void syncKeys(Integer userId, com.gymmanagement.usermanagement.Request.KeySyncRequest request);

    com.gymmanagement.usermanagement.Response.KeySyncResponse getKeys(Integer userId);
}
