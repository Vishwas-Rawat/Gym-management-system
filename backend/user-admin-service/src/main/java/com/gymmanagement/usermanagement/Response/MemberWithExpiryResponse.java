package com.gymmanagement.usermanagement.Response;

import lombok.Data;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import com.gymmanagement.commonservices.entity.Member;

@Data
public class MemberWithExpiryResponse {
    private Integer memberId;
    private Integer planId; // ⭐ NEW: For ID-based plan selection
    private String fullName;
    private String email;
    private String phoneNo;
    private LocalDate joiningDate;
    private LocalDate planStartDate;     // ← New
    private Integer monthsPaid;
    private Integer monthsFree;
    private Integer totalMonths;
    private LocalDate planExpiryDate;
    private Long daysRemaining;
    private String status;
    private String buttonColor;          // ← For frontend

    public MemberWithExpiryResponse(Member member) {
        this.memberId = member.getMemberId();
        this.planId = member.getPlan() != null ? member.getPlan().getPlanId() : null; // ⭐ Set Plan ID
        this.fullName = member.getUser().getUserProfile() != null
            ? member.getUser().getUserProfile().getFirstName() + " " +
              (member.getUser().getUserProfile().getLastName() != null ? member.getUser().getUserProfile().getLastName() : "")
            : "Member";
        this.email = member.getUser().getEmail();
        this.phoneNo = member.getUser().getPhoneNumber();
        this.joiningDate = member.getJoiningDate();
        this.planStartDate = member.getPlanStartDate() != null ? member.getPlanStartDate() : member.getJoiningDate();
        this.monthsPaid = member.getMonthsPaid();
        this.monthsFree = member.getMonthsFree() != null ? member.getMonthsFree() : 0;
        this.totalMonths = this.monthsPaid + this.monthsFree;

        // Accurate expiry using plan_start_date
        this.planExpiryDate = this.planStartDate.plusMonths(this.totalMonths).minusDays(1);
        this.daysRemaining = ChronoUnit.DAYS.between(LocalDate.now(), this.planExpiryDate);

        // Status logic
        if (this.daysRemaining < 0) {
            this.status = "EXPIRED";
            this.buttonColor = "RED";
        } else if (this.daysRemaining <= 10) {
            this.status = "EXPIRING_SOON";
            this.buttonColor = "YELLOW";
        } else {
            this.status = "ACTIVE";
            this.buttonColor = "GREEN";
        }
    }
}