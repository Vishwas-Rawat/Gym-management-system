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
    private Long gymId;

    // -------- ACTIVITY --------
    private long attendanceCount;
    private int attendanceStreak;
    private int bestStreak;
    private java.util.List<java.time.LocalDate> attendanceHistory;

    // -------- PLANS --------
    private Object workoutPlan; // JSON from workout module
    private Object dietPlan; // JSON from diet module

    // -------- COMMUNICATION --------
    private Integer trainerUserId;
}
