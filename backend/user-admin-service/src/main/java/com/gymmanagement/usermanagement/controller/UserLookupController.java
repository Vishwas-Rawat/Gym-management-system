package com.gymmanagement.usermanagement.controller;

import com.gymmanagement.commonservices.entity.User;
import com.gymmanagement.commonservices.entity.UserProfile;
import com.gymmanagement.usermanagement.repository.MemberRepository;
import com.gymmanagement.usermanagement.repository.TrainerRepository;
import com.gymmanagement.usermanagement.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserLookupController {

        private final UserRepository userRepository;
        private final TrainerRepository trainerRepository;
        private final MemberRepository memberRepository;

        public UserLookupController(UserRepository userRepository,
                        TrainerRepository trainerRepository,
                        MemberRepository memberRepository) {
                this.userRepository = userRepository;
                this.trainerRepository = trainerRepository;
                this.memberRepository = memberRepository;
        }

        @GetMapping("/email/{email}")
        public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
                return userRepository.findByEmail(email)
                                .map(this::mapToDto)
                                .map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
        }

        @GetMapping("/{userId}")
        public ResponseEntity<?> getUserById(@PathVariable Integer userId) {
                return userRepository.findById(userId)
                                .map(this::mapToDto)
                                .map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
        }

        private UserDto mapToDto(User user) {
                String firstName = "User";
                String lastName = "Name";
                Long gymId = null;

                if (user.getUserProfile() != null) {
                        UserProfile p = user.getUserProfile();
                        firstName = p.getFirstName();
                        lastName = p.getLastName();
                }

                // Determine Gym ID based on Role
                if (com.gymmanagement.commonservices.enumeration.Role.TRAINER.equals(user.getRole())) {
                        gymId = trainerRepository.findByUser(user).stream()
                                        .findFirst()
                                        .map(t -> t.getGym().getGymId())
                                        .orElse(null);
                } else if (com.gymmanagement.commonservices.enumeration.Role.MEMBER.equals(user.getRole())) {
                        gymId = memberRepository.findByUser(user).stream()
                                        .findFirst()
                                        .map(m -> m.getGym().getGymId())
                                        .orElse(null);
                }

                return new UserDto(
                                user.getUserId(),
                                user.getEmail(),
                                user.getRole().name(),
                                user.getIsActive(),
                                firstName,
                                lastName,
                                gymId);
        }

        // DTO matching Trainer Panel's expectation
        record UserDto(
                        Integer userId,
                        String email,
                        String role,
                        Boolean isActive,
                        String firstName,
                        String lastName,
                        Long gymId) {
        }
}
