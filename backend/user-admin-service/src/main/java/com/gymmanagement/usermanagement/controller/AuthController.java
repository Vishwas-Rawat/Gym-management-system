package com.gymmanagement.usermanagement.controller;

import com.gymmanagement.commonservices.entity.RefreshToken;
import com.gymmanagement.commonservices.entity.Trainer;
import com.gymmanagement.usermanagement.Request.TokenRefreshRequest;
import com.gymmanagement.usermanagement.Response.TokenRefreshResponse;
import com.gymmanagement.usermanagement.config.security.JwtUtil;
import com.gymmanagement.usermanagement.repository.TrainerRepository;
import com.gymmanagement.usermanagement.service.RefreshTokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private TrainerRepository trainerRepository;

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    // Check if trainerId is needed
                    Integer trainerId = null;
                    if (com.gymmanagement.commonservices.enumeration.Role.TRAINER.equals(user.getRole())) {
                        trainerId = trainerRepository.findByUser_UserId(user.getUserId()).stream()
                                .filter(t -> Boolean.TRUE.equals(t.getIsActive()))
                                .map(Trainer::getTrainerId)
                                .findFirst()
                                .orElse(null);
                    }

                    String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), trainerId);
                    return ResponseEntity.ok(new TokenRefreshResponse(token, requestRefreshToken));
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Stateless JWT logout: Client-side simply discards the token.
        // Server-side: Optional blacklist implementation (not yet active).
        // Return 200 OK to confirm request received.
        return ResponseEntity.ok("Logged out successfully");
    }
}
