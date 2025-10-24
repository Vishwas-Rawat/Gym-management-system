package com.gymmanagement.usermanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.gymmanagement.usermanagement.Request.LoginRequest;
import com.gymmanagement.usermanagement.Request.RegisterRequest;
import com.gymmanagement.usermanagement.Response.LoginResponse;
import com.gymmanagement.usermanagement.Response.RegisterResponse;
import com.gymmanagement.usermanagement.service.UserService;

@RestController
@RequestMapping("/user")
public class RegisterController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public RegisterResponse register(@RequestBody RegisterRequest request) {
        if (!"ADMIN".equalsIgnoreCase(request.getRole())) {
            return new RegisterResponse("error", "Only Admin registration is allowed currently.", null, null);
        }
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
        return userService.login(request.getEmail(), request.getPassword());
    }
}
