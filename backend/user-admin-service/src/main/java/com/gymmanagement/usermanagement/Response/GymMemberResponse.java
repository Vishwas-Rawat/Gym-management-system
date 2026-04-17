// src/main/java/com/gymmanagement/usermanagement/Response/GymMemberResponse.java
package com.gymmanagement.usermanagement.Response;

import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.commonservices.entity.UserProfile;
import lombok.Data;
import java.time.LocalDate;

@Data
public class GymMemberResponse {

    private Integer memberId;
    private String fullName;
    private String email;
    private String phoneNo;
    private String membershipPlan;
    private Integer planId; // ⭐ NEW: For ID-based plan selection
    private String workoutTimeSlot;
    private String trainerName; // ✅ Added trainerName
    private LocalDate expiryDate;

    public GymMemberResponse(Member member) {
        this.memberId = member.getMemberId();
        UserProfile profile = member.getUser().getUserProfile();

        this.fullName = buildFullName(profile);
        this.email = member.getUser().getEmail();
        this.phoneNo = member.getUser().getPhoneNumber();
        this.membershipPlan = member.getMembershipPlan();
        this.planId = member.getPlan() != null ? member.getPlan().getPlanId() : null; // ⭐ Set Plan ID
        this.workoutTimeSlot = member.getWorkoutTimeSlot();
        this.expiryDate = member.getEndDate();

        // ✅ Populate trainerName if assigned
        if (member.getTrainer() != null && member.getTrainer().getUser() != null) {
            UserProfile tp = member.getTrainer().getUser().getUserProfile();
            this.trainerName = buildFullName(tp);
        } else {
            this.trainerName = null;
        }
    }

    private String buildFullName(UserProfile profile) {
        if (profile == null)
            return "Name Not Set";

        String firstName = profile.getFirstName() != null ? profile.getFirstName().trim() : "";
        String lastName = profile.getLastName() != null ? profile.getLastName().trim() : "";

        if (firstName.isEmpty())
            return "Member";
        return lastName.isEmpty() ? firstName : firstName + " " + lastName;
    }
}