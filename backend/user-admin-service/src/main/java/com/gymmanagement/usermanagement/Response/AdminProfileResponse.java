package com.gymmanagement.usermanagement.Response;

import com.gymmanagement.commonservices.entity.User;
import com.gymmanagement.commonservices.entity.UserProfile;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class AdminProfileResponse {

    // User basic info
    private Integer userId;
    private String email;
    private String username;
    private String phoneNumber;
    private String role;
    private Boolean isActive;
    private Boolean isEmailVerified;
    private String registrationStatus;

    // Profile info
    private String firstName;
    private String lastName;
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private Double weight;
    private Double height;

    // Account timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AdminProfileResponse(User user, UserProfile profile) {
        // User basic info
        this.userId = user.getUserId();
        this.email = user.getEmail();
        this.username = user.getUsername();
        this.phoneNumber = user.getPhoneNumber();
        this.role = user.getRole() != null ? user.getRole().name() : "ADMIN";
        this.isActive = user.getIsActive();
        this.isEmailVerified = user.getIsEmailVerified();
        this.registrationStatus = user.getRegistrationStatus() != null
                ? user.getRegistrationStatus().name()
                : null;

        // Profile info
        if (profile != null) {
            this.firstName = profile.getFirstName();
            this.lastName = profile.getLastName();
            this.fullName = buildFullName(profile);
            this.dateOfBirth = profile.getDateOfBirth();
            this.gender = profile.getGender();
            this.address = profile.getAddress();
            this.weight = profile.getWeight();
            this.height = profile.getHeight();
        }

        // Account timestamps
        this.createdAt = user.getCreatedAt();
        this.updatedAt = user.getUpdatedAt();
    }

    private String buildFullName(UserProfile profile) {
        if (profile == null)
            return "Admin";

        String firstName = profile.getFirstName() != null ? profile.getFirstName().trim() : "";
        String lastName = profile.getLastName() != null ? profile.getLastName().trim() : "";

        if (firstName.isEmpty())
            return "Admin";
        return lastName.isEmpty() ? firstName : firstName + " " + lastName;
    }
}
