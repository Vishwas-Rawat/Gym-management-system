package com.gymmanagement.usermanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.gymmanagement.commonservices.entity.User;
import com.gymmanagement.usermanagement.Response.GymRegisterResponse;
import com.gymmanagement.usermanagement.repository.UserRepository;
import com.gymmanagement.usermanagement.service.GymService;
import com.gymmanagement.commonservices.entity.Gym;

import java.util.List;

@RestController
@RequestMapping("/gym")
public class GymController {

	@Autowired
	private GymService gymService;

	// @Autowired
	// private UserRepository userRepository;

	// ✅ Create multiple gyms (Admin only)
	@PostMapping("/create")
	public List<GymRegisterResponse> createGyms(@RequestBody List<Gym> gyms, Authentication authentication) {
		User admin = (User) authentication.getPrincipal();

		return gymService.createGyms(gyms, admin.getUserId());
	}

	// ✅ Get all gyms by logged-in admin
	@GetMapping("/my-gyms")
	// public List<GymRegisterResponse> getGymsByAdmin(Authentication
	// authentication) {
	// String identity = authentication.getName(); // this is email from JWT
	//
	// User admin = userRepository.findByEmail(identity).orElseThrow(() -> new
	// RuntimeException("Admin not found"));
	//
	// return gymService.getAllGymsByAdmin(admin.getUserId());
	// }
	public List<GymRegisterResponse> getGymsByAdmin(Authentication authentication) {
		User admin = (User) authentication.getPrincipal();
		return gymService.getAllGymsByAdmin(admin.getUserId());
	}

	// ✅ Update gym by gymId (JWT + gymId)
	@PutMapping("/update/{gymId}")
	public GymRegisterResponse updateGym(@PathVariable Long gymId, @RequestBody Gym updatedGym,
			Authentication authentication) {
		User admin = (User) authentication.getPrincipal();

		return gymService.updateGym(gymId, updatedGym, admin.getUserId());
	}

	@DeleteMapping("/delete/{gymId}")
	public ResponseEntity<String> softDeleteGym(@PathVariable Long gymId, Authentication authentication) {
		User admin = (User) authentication.getPrincipal();

		boolean deleted = gymService.softDeleteGym(gymId, admin.getUserId());

		if (deleted)
			return ResponseEntity.ok("Gym soft deleted successfully.");
		else
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to delete gym.");
	}

	// ✅ FORCE DELETE: Deletes Gym + Members + Trainers
	@DeleteMapping("/force-delete/{gymId}")
	public ResponseEntity<String> forceDeleteGym(@PathVariable Long gymId, Authentication authentication) {
		User admin = (User) authentication.getPrincipal();

		gymService.forceDeleteGym(gymId, admin.getUserId());

		return ResponseEntity.ok("Gym and all related members/trainers force deleted successfully.");
	}
}
