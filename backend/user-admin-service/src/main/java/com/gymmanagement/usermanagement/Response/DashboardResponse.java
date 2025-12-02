package com.gymmanagement.usermanagement.Response;

import lombok.Data;
import java.util.List;

@Data
public class DashboardResponse {

    // --- USER COUNTS ---
    private long totalMembers;
    private long activeMembers;
    private long totalTrainers;

    // --- ATTENDANCE ---
    private long trainersPresentToday;
    private long membersPresentToday;

    // --- REVENUE ---
    private double totalRevenue;
    private double monthlyRevenue;

    // --- ACTION ITEMS ---
    private long expiringMembershipCount;
    private long pendingDietRequests;
    private long pendingWorkoutRequests;

    // --- LISTS ---
    private List<ExpiringMemberDTO> expiringMembers;
    private List<TrainerActivityDTO> trainerActivity;
}
