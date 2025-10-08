package com.gymmanagement.usermanagement.Response;

import com.gymmanagement.commonservices.entity.Member;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class UpdateMemberResponse {
    private Integer memberId;
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private String gender;
    private String phoneNumber;
    private String address;
    private String fitnessGoal;
    private String membershipPlan;
    private LocalDate joiningDate;
    private Double amountPaid;
    private String paymentMethod;
    private String workoutTimeSlot;
    private LocalDateTime updatedAt;
    private String message;

    public UpdateMemberResponse(Member member, String message) {
        if (member != null) {
            this.memberId = member.getMemberId();
            this.firstName = member.getUser().getFirstName();
            this.lastName = member.getUser().getLastName();

            // ✅ Generate fullName safely
            this.fullName = (firstName != null ? firstName : "") +
                            (lastName != null ? " " + lastName : "");

            this.email = member.getUser().getEmail();
            this.gender = member.getUser().getGender();
            this.phoneNumber = member.getUser().getPhoneNumber();
            this.address = member.getUser().getAddress();
            this.fitnessGoal = member.getFitnessGoal();
            this.membershipPlan = member.getMembershipPlan();
            this.joiningDate = member.getJoiningDate();
            this.amountPaid = member.getAmountPaid();
            this.paymentMethod = member.getPaymentMethod();
            this.workoutTimeSlot = member.getWorkoutTimeSlot();
            this.updatedAt = member.getUpdatedAt();
        }
        this.message = message;
    }
}
