// src/main/java/com/gymmanagement/usermanagement/Response/GymMemberResponse.java
package com.gymmanagement.usermanagement.Response;

import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.commonservices.entity.UserProfile;
import lombok.Data;

@Data
public class GymMemberResponse {

    private Integer memberId;
    private String fullName;
    private String email;
    private String phoneNo;
    private String membershipPlan;
    private String workoutTimeSlot;
    private String trainerName; // ✅ Added trainerName

    public GymMemberResponse(Member member) {
        this.memberId = member.getMemberId();
        UserProfile profile = member.getUser().getUserProfile();

        this.fullName = buildFullName(profile);
        this.email = member.getUser().getEmail();
        this.phoneNo = member.getUser().getPhoneNumber();
        this.membershipPlan = member.getMembershipPlan();
        this.workoutTimeSlot = member.getWorkoutTimeSlot();

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