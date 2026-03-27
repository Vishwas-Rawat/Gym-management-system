package com.gymmanagement.usermanagement.service.impl;

import com.gymmanagement.commonservices.entity.User;
import com.gymmanagement.commonservices.entity.UserProfile;
import com.gymmanagement.commonservices.enumeration.Role;
import com.gymmanagement.usermanagement.Response.AdminProfileResponse;
import com.gymmanagement.usermanagement.repository.UserProfileRepository;
import com.gymmanagement.usermanagement.repository.UserRepository;
import com.gymmanagement.usermanagement.service.AdminProfileService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminProfileServiceImpl implements AdminProfileService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    public AdminProfileServiceImpl(UserRepository userRepository, UserProfileRepository userProfileRepository) {
        this.userRepository = userRepository;
        this.userProfileRepository = userProfileRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminProfileResponse getAdminProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));

        // Verify user is an admin
        if (user.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("User is not an admin");
        }

        UserProfile profile = userProfileRepository.findByUser_UserId(user.getUserId())
                .orElse(null);

        return new AdminProfileResponse(user, profile);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminProfileResponse getAdminProfileById(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        // Verify user is an admin
        if (user.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("User is not an admin");
        }

        UserProfile profile = userProfileRepository.findByUser_UserId(userId)
                .orElse(null);

        return new AdminProfileResponse(user, profile);
    }
}
