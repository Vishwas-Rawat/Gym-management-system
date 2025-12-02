package com.gymmanagement.usermanagement.Response;

import lombok.Data;

@Data
public class MemberDashboardResponse {

    // -------- PROFILE --------
    private Integer memberId;
    private Integer userId;
    private String fullName;
    private String email;
    private String trainerName;
    private String trainerPhone;
    private String trainerSpecialization;
    private String membershipExpiryDate;

    // -------- ACTIVITY --------
    private long attendanceCount;
    private int attendanceStreak;

    // -------- PLANS --------
    private Object workoutPlan;  // JSON from workout module
    private Object dietPlan;     // JSON from diet module

    // -------- COMMUNICATION --------
    private Integer trainerUserId;
}
