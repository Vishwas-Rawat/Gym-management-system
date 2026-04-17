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

    // --- ASSIGNMENTS ---
    private long membersWithTrainer;
    private long membersWithoutTrainer;

    // --- LISTS ---
    private List<ExpiringMemberDTO> expiringMembers;
}
