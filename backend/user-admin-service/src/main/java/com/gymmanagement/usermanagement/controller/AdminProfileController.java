package com.gymmanagement.usermanagement.controller;

import com.gymmanagement.usermanagement.Response.AdminProfileResponse;
import com.gymmanagement.usermanagement.service.AdminProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminProfileController {

    private final AdminProfileService adminProfileService;

    public AdminProfileController(AdminProfileService adminProfileService) {
        this.adminProfileService = adminProfileService;
    }

    /**
     * Get current admin's full profile
     * Uses JWT token to identify the admin
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/profile")
    public ResponseEntity<AdminProfileResponse> getCurrentAdminProfile(Authentication authentication) {
        // Extract userId from JWT token
        String email = authentication.getName();
        AdminProfileResponse profile = adminProfileService.getAdminProfileByEmail(email);
        return ResponseEntity.ok(profile);
    }

    /**
     * Get admin profile by userId (for internal use)
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/profile/{userId}")
    public ResponseEntity<AdminProfileResponse> getAdminProfileById(@PathVariable Integer userId) {
        AdminProfileResponse profile = adminProfileService.getAdminProfileById(userId);
        return ResponseEntity.ok(profile);
    }
}
