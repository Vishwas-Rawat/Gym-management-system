// src/main/java/com/gymmanagement/usermanagement/Response/AddMemberResponse.java
package com.gymmanagement.usermanagement.Response;

import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.commonservices.enumeration.Role;

import lombok.Data;

@Data
public class AddMemberResponse {

    private Integer memberId;
    private String name;
    private String email;
    private String timing;
    private Integer monthsPaid;
    private Integer monthsFree;
    private Double totalAmount;
    private String paymentMethod;
    private String startDate; // ISO format: "2025-11-05"
    private String expiryDate;
    private String message;
    private Role role;

    public AddMemberResponse(Member member, String message) {
        this.memberId = member.getMemberId();
        this.name = member.getUser().getUserProfile() != null ? member.getUser().getUserProfile().getFirstName()
                : "Member";
        this.email = member.getUser().getEmail();
        this.timing = member.getWorkoutTimeSlot();

        this.monthsPaid = member.getMonthsPaid();
        this.monthsFree = member.getMonthsFree();
        this.totalAmount = member.getTotalAmount();
        this.paymentMethod = member.getPaymentMethod();
        this.role = member.getUser().getRole();
        this.startDate = member.getJoiningDate() != null ? member.getJoiningDate().toString() : null;
        this.expiryDate = member.getEndDate() != null ? member.getEndDate().toString() : null;
        this.message = message;
    }
}