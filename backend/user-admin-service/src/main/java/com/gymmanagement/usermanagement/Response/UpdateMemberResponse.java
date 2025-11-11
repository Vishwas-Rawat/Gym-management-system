// src/main/java/com/gymmanagement/usermanagement/Response/UpdateMemberResponse.java
package com.gymmanagement.usermanagement.Response;

import com.gymmanagement.commonservices.entity.Member;
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
            this.fullName = member.getUser().getFirstName() +
                    (member.getUser().getLastName() != null ? " " + member.getUser().getLastName() : "");
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
}