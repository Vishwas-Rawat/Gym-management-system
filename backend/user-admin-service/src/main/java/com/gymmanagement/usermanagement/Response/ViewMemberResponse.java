package com.gymmanagement.usermanagement.Response;

import com.gymmanagement.commonservices.entity.Member;
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
    private String timing; // "6:30 AM to 8:00 AM"
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

            String firstName = member.getUser().getFirstName() != null ? member.getUser().getFirstName() : "";
            String lastName = member.getUser().getLastName() != null ? member.getUser().getLastName() : "";
            this.fullName = (firstName + " " + lastName).trim();

            this.email = member.getUser().getEmail();
            this.phoneNo = member.getUser().getPhoneNumber();

            this.membershipPlan = member.getMembershipPlan();
            this.monthsFree = member.getMonthsFree() != null ? member.getMonthsFree() : 0;

            // Parse monthsPaid from membershipPlan if available
            if (member.getMembershipPlan() != null && member.getMembershipPlan().contains("months")) {
                try {
                    String num = member.getMembershipPlan().split(" ")[0];
                    this.monthsPaid = Integer.parseInt(num);
                } catch (NumberFormatException e) {
                    this.monthsPaid = member.getMonthsPaid() != null ? member.getMonthsPaid() : 0;
                }
            } else {
                this.monthsPaid = member.getMonthsPaid() != null ? member.getMonthsPaid() : 0;
            }

            this.timing = member.getWorkoutTimeSlot();

            // Financial fields
            this.registrationFee = member.getRegistrationFee() != null ? member.getRegistrationFee() : 0.0;
            this.planPrice = member.getPlanPrice() != null ? member.getPlanPrice() : 0.0;
            this.discount = member.getDiscount() != null ? member.getDiscount() : 0.0;

            // Total paid is the final amount after discount
            this.totalPaid = member.getAmountPaid() != null ? member.getAmountPaid() : 
                             Math.max(0, this.registrationFee + this.planPrice - this.discount);

            this.paymentMethod = member.getPaymentMethod();
            this.startDate = member.getJoiningDate();
            this.createdAt = member.getCreatedAt();
            this.updatedAt = member.getUpdatedAt();
        }
        this.message = message;
    }
}
