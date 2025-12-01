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
    private String message;
    private Role role;           // ← ADD THIS

    public AddMemberResponse(Member member, String message) {
        this.memberId = member.getMemberId();

        // Build timing: "6:00 AM to 7:00 PM"
        String from = formatTime(member.getFromHour(), member.getFromMinute(), member.getFromPeriod());
        String to = formatTime(member.getToHour(), member.getToMinute(), member.getToPeriod());
        this.timing = (from != null && to != null) ? from + " to " + to : null;

        this.monthsPaid = member.getMonthsPaid();
        this.monthsFree = member.getMonthsFree();
        this.totalAmount = member.getTotalAmount();
        this.paymentMethod = member.getPaymentMethod();
        this.role = member.getUser().getRole();  // ← SHOW ROLE
        this.startDate = member.getJoiningDate() != null ? member.getJoiningDate().toString() : null;
        this.message = message;
    }

    private String formatTime(Integer hour, String minute, String period) {
        if (hour == null || minute == null || period == null) return null;
        return String.format("%d:%s %s", hour, minute, period);
    }
}