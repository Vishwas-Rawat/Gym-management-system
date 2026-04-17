package com.gymmanagement.usermanagement.controller;

import com.gymmanagement.usermanagement.Request.ForgotPasswordRequest;
import com.gymmanagement.usermanagement.Request.LoginRequest;
import com.gymmanagement.usermanagement.Request.RegisterRequest;
import com.gymmanagement.usermanagement.Request.ResetPasswordRequest;
import com.gymmanagement.usermanagement.Response.LoginResponse;
import com.gymmanagement.usermanagement.Response.RegisterResponse;
import com.gymmanagement.usermanagement.service.UserService;
import jakarta.validation.Valid;
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
    public RegisterResponse register(@Valid @RequestBody RegisterRequest request) {
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

    @PostMapping("/forgot-password")
    public RegisterResponse forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return userService.forgotPassword(request);
    }

    @PostMapping("/reset-password")
    public RegisterResponse resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return userService.resetPassword(request);
    }

    // ===================================
    // E2EE KEY SYNC ENDPOINTS
    // ===================================
    @PostMapping("/sync-keys")
    public org.springframework.http.ResponseEntity<?> syncKeys(
            org.springframework.security.core.Authentication auth,
            @RequestBody com.gymmanagement.usermanagement.Request.KeySyncRequest request) {

        Integer userId = getUserIdFromAuth(auth);
        userService.syncKeys(userId, request);
        return org.springframework.http.ResponseEntity.ok("Keys synced successfully");
    }

    @GetMapping("/sync-keys")
    public org.springframework.http.ResponseEntity<com.gymmanagement.usermanagement.Response.KeySyncResponse> getKeys(
            org.springframework.security.core.Authentication auth) {

        Integer userId = getUserIdFromAuth(auth);
        return org.springframework.http.ResponseEntity.ok(userService.getKeys(userId));
    }

    private Integer getUserIdFromAuth(org.springframework.security.core.Authentication auth) {
        if (auth == null)
            throw new RuntimeException("Unauthorized");
        if (auth.getPrincipal() instanceof com.gymmanagement.commonservices.entity.User u) {
            return u.getUserId();
        }
        throw new RuntimeException("Unauthorized");
    }
}