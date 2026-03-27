package com.gymmanagement.usermanagement.controller;

import com.gymmanagement.commonservices.entity.BlacklistedToken;
import com.gymmanagement.usermanagement.config.security.JwtUtil;
import com.gymmanagement.usermanagement.repository.BlacklistedTokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class LogoutController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private BlacklistedTokenRepository blacklistedTokenRepository;

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("No token provided");
        }

        String token = authHeader.substring(7);

        if (jwtUtil.isTokenBlacklisted(token)) {
            return ResponseEntity.ok("Already logged out");
        }

        BlacklistedToken entry = new BlacklistedToken();
        entry.setToken(token);
        entry.setExpiresAt(jwtUtil.extractExpiration(token));
        blacklistedTokenRepository.save(entry);

        return ResponseEntity.ok("Logged out successfully");
    }
}