// src/main/java/com/gymmanagement/usermanagement/Response/UpdateMemberResponse.java
package com.gymmanagement.usermanagement.Response;

import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.commonservices.entity.UserProfile;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class UpdateMemberResponse {

    private Integer memberId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String membershipPlan;
    private String workoutTimeSlot;
    private Double totalAmount;
    private String paymentMethod;
    private LocalDate joiningDate;
    private LocalDateTime updatedAt;
    private String message;

    public UpdateMemberResponse(Member member, String message) {
        if (member != null) {
            this.memberId = member.getMemberId();
            this.fullName = buildFullName(member.getUser().getUserProfile());
            this.email = member.getUser().getEmail();
            this.phoneNumber = member.getUser().getPhoneNumber();
            this.membershipPlan = member.getMembershipPlan();
            this.workoutTimeSlot = member.getWorkoutTimeSlot();
            this.totalAmount = member.getTotalAmount();
            this.paymentMethod = member.getPaymentMethod();
            this.joiningDate = member.getJoiningDate();
            this.updatedAt = member.getUpdatedAt();
        }
        this.message = message;
    }

    private String buildFullName(UserProfile profile) {
        if (profile == null) return "Name Not Set";

        String firstName = profile.getFirstName() != null ? profile.getFirstName().trim() : "";
        String lastName = profile.getLastName() != null ? profile.getLastName().trim() : "";

        if (firstName.isEmpty()) return "Member";
        return lastName.isEmpty() ? firstName : firstName + " " + lastName;
    }
}