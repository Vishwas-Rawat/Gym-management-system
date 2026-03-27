package com.gymmanagement.usermanagement.controller;

import com.gymmanagement.usermanagement.Request.LoginRequest;
import com.gymmanagement.usermanagement.Request.RegisterRequest;
import com.gymmanagement.usermanagement.Response.LoginResponse;
import com.gymmanagement.usermanagement.Response.RegisterResponse;
import com.gymmanagement.usermanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class RegisterController {

    @Autowired
    private UserService userService;

    // REMOVED: UserRepository injection and countByRole check
    // → You said you don't want to block multiple admin registrations

    @PostMapping("/register")
    public RegisterResponse register(@RequestBody RegisterRequest request) {
        // Anyone can register as admin → no restrictions
        return userService.registerUser(request);
    }

    @PostMapping("/verify-otp")
    public RegisterResponse verifyOtp(@RequestParam Integer userId, @RequestParam String otpCode) {
        return userService.verifyOtp(userId, otpCode);
    }

    @PostMapping("/resend-otp")
    public RegisterResponse resendOtp(@RequestParam Integer userId) {
        return userService.resendOtp(userId);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return userService.login(request.getIdentifier(), request.getPassword());
    }
}