package com.gymmanagement.usermanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.gymmanagement.usermanagement.Response.GymRegisterResponse;
import com.gymmanagement.usermanagement.service.GymService;
import com.gymmanagement.commonservices.entity.Gym;

import java.util.List;

@RestController
@RequestMapping("/gym")
public class GymController {

    @Autowired
    private GymService gymService;

    // ✅ Create multiple gyms (Admin only)
    @PostMapping("/create")
    public List<GymRegisterResponse> createGyms(@RequestBody List<Gym> gyms, Authentication authentication) {
        String email = authentication.getName(); // email from JWT
        return gymService.createGyms(gyms, email);
    }

    // ✅ Get all gyms by logged-in admin
    @GetMapping("/my-gyms")
    public List<GymRegisterResponse> getGymsByAdmin(Authentication authentication) {
        String email = authentication.getName(); // from JWT
        return gymService.getAllGymsByAdmin(email);
    }

    // ✅ Update gym by gymId (JWT + gymId)
    @PutMapping("/update/{gymId}")
    public GymRegisterResponse updateGym(
            @PathVariable Long gymId,
            @RequestBody Gym updatedGym,
            Authentication authentication
    ) {
        String email = authentication.getName(); // from JWT
        return gymService.updateGym(gymId, updatedGym, email);
    }

    // 🗑 Soft Delete gym with Admin check
    @DeleteMapping("/delete/{gymId}")
    public ResponseEntity<String> softDeleteGym(
            @PathVariable Long gymId,
            Authentication authentication
    ) {
        String email = authentication.getName(); // from JWT
        boolean deleted = gymService.softDeleteGym(gymId, email);

        if (deleted)
            return ResponseEntity.ok("Gym soft deleted successfully.");
        else
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to delete gym.");
    }
}
