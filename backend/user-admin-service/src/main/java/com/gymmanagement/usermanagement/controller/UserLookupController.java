package com.gymmanagement.usermanagement.controller;

import com.gymmanagement.usermanagement.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserLookupController {

        private final UserRepository userRepository;

        public UserLookupController(UserRepository userRepository) {
                this.userRepository = userRepository;
        }

        @GetMapping("/email/{email}")
        public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
                return userRepository.findByEmail(email)
                                .map(user -> ResponseEntity.ok(
                                                new UserDto(
                                                                user.getUserId(),
                                                                user.getEmail(),
                                                                user.getRole().name(),
                                                                true, "User", "Name")))
                                .orElse(ResponseEntity.notFound().build());
        }

        @GetMapping("/{userId}")
        public ResponseEntity<?> getUserById(@PathVariable Integer userId) {
                return userRepository.findById(userId)
                                .map(user -> ResponseEntity.ok(
                                                new UserDto(
                                                                user.getUserId(),
                                                                user.getEmail(),
                                                                user.getRole().name(),
                                                                true, "User", "Name")))
                                .orElse(ResponseEntity.notFound().build());
        }

        // DTO matching Trainer Panel's expectation
        record UserDto(
                        Integer userId,
                        String email,
                        String role,
                        Boolean isActive,
                        String firstName,
                        String lastName) {
        }
}
