package com.gymmanagement.usermanagement.controller;

import com.gymmanagement.usermanagement.repository.UserProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserProfileController {

    private final UserProfileRepository repo;

    public UserProfileController(UserProfileRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable Integer userId) {

        return repo.findByUser_UserId(userId)
                .map(p -> ResponseEntity.ok(
                        new ProfileDto(
                                p.getUser().getUserId(),
                                p.getFirstName(),
                                p.getLastName(),
                                p.getDateOfBirth(),
                                p.getWeight(),
                                p.getHeight())))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public java.util.List<UserSearchDto> searchUsers(@RequestParam String query) {
        return repo.searchByName(query).stream()
                .map(p -> new UserSearchDto(
                        p.getUser().getUserId(),
                        p.getFirstName(),
                        p.getLastName(),
                        p.getUser().getEmail(),
                        p.getUser().getRole().name()))
                .toList();
    }

    record UserSearchDto(Integer userId, String firstName, String lastName, String email, String role) {
    }

    record ProfileDto(Integer userId, String firstName, String lastName, java.time.LocalDate dateOfBirth, Double weight,
            Double height) {
    }
}
