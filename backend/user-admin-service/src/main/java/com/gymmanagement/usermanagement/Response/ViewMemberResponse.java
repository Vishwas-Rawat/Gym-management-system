package com.gymmanagement.usermanagement.Response;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.gymmanagement.commonservices.entity.Member;

import lombok.Data;

@Data
public class ViewMemberResponse {
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
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String message;

    public ViewMemberResponse(Member member, String message) {
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
        this.createdAt = member.getCreatedAt();
        this.updatedAt = member.getUpdatedAt();
        this.message = message;
    }
}
