package com.gymmanagement.usermanagement.Response;

import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.commonservices.entity.UserProfile;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ViewMemberResponse {

    private Integer memberId;
    private Integer userId; // Added for Chat/Auth integration
    private Integer trainerUserId; // ⭐ NEW: For Chat Contact Logic
    private String fullName;
    private String email;
    private String phoneNo;
    private String membershipPlan;
    private Integer monthsPaid;
    private Integer monthsFree;
    private Long gymId;
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

    // ⭐ NEW FIELDS FOR MEMBER PROFILE
    private String address;
    private String gender;
    private LocalDate dateOfBirth;
    private String fitnessGoal;

    // ⭐ NEW: Days Remaining
    private Long daysRemaining;

    public ViewMemberResponse(Member member, String message) {
        if (member != null) {
            this.memberId = member.getMemberId();
            this.userId = member.getUser().getUserId(); // Populate userId

            // ⭐ Populate Trainer User ID
            if (member.getTrainer() != null && member.getTrainer().getUser() != null) {
                this.trainerUserId = member.getTrainer().getUser().getUserId();
            }

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

            // ⭐ Populate New Profile Fields
            this.fitnessGoal = member.getFitnessGoal() != null ? member.getFitnessGoal() : "Not Specified";

            if (member.getUser().getUserProfile() != null) {
                UserProfile p = member.getUser().getUserProfile();
                this.address = p.getAddress();
                this.gender = p.getGender();
                this.dateOfBirth = p.getDateOfBirth();
                // firstName/lastName are already used for fullName
            }

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

            // ⭐ Calculate Days Remaining
            try {
                LocalDate start = member.getPlanStartDate() != null ? member.getPlanStartDate()
                        : member.getJoiningDate();
                if (start != null) {
                    int totalMonths = (member.getMonthsPaid() != null ? member.getMonthsPaid() : 0)
                            + (member.getMonthsFree() != null ? member.getMonthsFree() : 0);
                    LocalDate expiryDate = start.plusMonths(totalMonths);
                    this.daysRemaining = java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), expiryDate);
                } else {
                    this.daysRemaining = 0L;
                }
            } catch (Exception e) {
                this.daysRemaining = 0L;
            }
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