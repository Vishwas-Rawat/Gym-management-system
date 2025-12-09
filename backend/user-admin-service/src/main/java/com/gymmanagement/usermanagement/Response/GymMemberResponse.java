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
    private Integer monthsPaid;
    private Integer monthsFree;
    private String gymName;
    private String trainerName; // Replaces trainerId
    private String timing; // workoutTimeSlot
    private Double registrationFee;
    private Double planPrice;
    private Double discount;
    private Double totalPaid;
    private String paymentMethod;
    private java.time.LocalDate startDate;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;

    public GymMemberResponse(Member member) {
        UserProfile profile = member.getUser().getUserProfile();

        this.memberId = member.getMemberId();
        this.fullName = buildFullName(profile);
        this.email = member.getUser().getEmail();
        this.phoneNo = member.getUser().getPhoneNumber();
        this.membershipPlan = member.getMembershipPlan();

        this.monthsPaid = member.getMonthsPaid();
        this.monthsFree = member.getMonthsFree();

        // Use Names instead of IDs
        this.gymName = member.getGym() != null ? member.getGym().getGymName() : "Unknown Gym";

        this.trainerName = (member.getTrainer() != null && member.getTrainer().getUser() != null)
                ? buildFullName(member.getTrainer().getUser().getUserProfile())
                : "No Trainer Assigned";

        this.timing = member.getWorkoutTimeSlot();

        this.registrationFee = member.getRegistrationFee();
        this.planPrice = member.getPlanPrice();
        this.discount = member.getDiscount();
        this.totalPaid = member.getAmountPaid() != null ? member.getAmountPaid() : member.getTotalAmount();
        this.paymentMethod = member.getPaymentMethod();

        this.startDate = member.getJoiningDate();
        this.createdAt = member.getCreatedAt();
        this.updatedAt = member.getUpdatedAt();
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