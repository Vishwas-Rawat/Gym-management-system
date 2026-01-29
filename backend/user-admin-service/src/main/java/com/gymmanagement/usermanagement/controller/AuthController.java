package com.gymmanagement.usermanagement.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Stateless JWT logout: Client-side simply discards the token.
        // Server-side: Optional blacklist implementation (not yet active).
        // Return 200 OK to confirm request received.
        return ResponseEntity.ok("Logged out successfully");
    }
}
