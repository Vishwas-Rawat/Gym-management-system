package com.gymmanagement.usermanagement.Response;

import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.commonservices.entity.UserProfile;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ViewMemberResponse {

    private Integer memberId;
    private String fullName;
    private String email;
    private String phoneNo;
    private String membershipPlan;
    private Integer monthsPaid;
    private Integer monthsFree;
    private Long gymId;
    private Integer trainerId;
    private String trainerName; // Added trainer name field
    private String timing; // e.g., "6:30 AM to 8:00 AM"
    private Double registrationFee;
    private Double planPrice;
    private Double discount;
    private Double totalPaid;
    private String paymentMethod;
    private LocalDate startDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String message;

    public ViewMemberResponse(Member member, String message) {
        if (member != null) {
            this.memberId = member.getMemberId();

            // Safely get full name from UserProfile
            this.fullName = getFullName(member.getUser().getUserProfile());

            this.email = member.getUser().getEmail();
            this.phoneNo = member.getUser().getPhoneNumber();
            this.gymId = member.getGym() != null ? member.getGym().getGymId() : null;

            this.membershipPlan = member.getMembershipPlan() != null ? member.getMembershipPlan() : "No Plan";
            this.monthsPaid = member.getMonthsPaid() != null ? member.getMonthsPaid() : 0;
            this.monthsFree = member.getMonthsFree() != null ? member.getMonthsFree() : 0;

            this.timing = member.getWorkoutTimeSlot() != null && !member.getWorkoutTimeSlot().trim().isEmpty()
                    ? member.getWorkoutTimeSlot()
                    : "Not Set";

            // Financials
            this.registrationFee = getDoubleOrZero(member.getRegistrationFee());
            this.planPrice = getDoubleOrZero(member.getPlanPrice());
            this.discount = getDoubleOrZero(member.getDiscount());

            // Prefer amountPaid if exists, otherwise calculate
            this.totalPaid = member.getAmountPaid() != null
                    ? member.getAmountPaid()
                    : Math.max(0.0, this.registrationFee + this.planPrice - this.discount);

            this.paymentMethod = member.getPaymentMethod() != null ? member.getPaymentMethod() : "Not Specified";
            this.startDate = member.getJoiningDate();
            this.createdAt = member.getCreatedAt();
            this.updatedAt = member.getUpdatedAt();
            this.trainerId = member.getTrainer() != null ? member.getTrainer().getTrainerId() : null;
            this.trainerName = (member.getTrainer() != null && member.getTrainer().getUser() != null)
                    ? getFullName(member.getTrainer().getUser().getUserProfile())
                    : "No Trainer Assigned";
        }

        this.message = message;
    }

    /**
     * Safely extract full name from UserProfile
     */
    private String getFullName(UserProfile profile) {
        if (profile == null) {
            return "Name Not Set";
        }

        String firstName = profile.getFirstName() != null ? profile.getFirstName().trim() : "";
        String lastName = profile.getLastName() != null ? profile.getLastName().trim() : "";

        if (firstName.isEmpty()) {
            return "Member";
        }

        return lastName.isEmpty() ? firstName : firstName + " " + lastName;
    }

    /**
     * Helper to safely handle null Double values
     */
    private Double getDoubleOrZero(Double value) {
        return value != null ? value : 0.0;
    }
}