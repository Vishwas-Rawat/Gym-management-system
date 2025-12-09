package com.gymmanagement.trainer.trainer_panel.dto.dashboard;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TrainerStatsDTO {
    private Integer trainerId;
    private String name;
    private String gymName;
    private Integer totalMembers;
    private Integer activeToday;
    private Long dietPlansAssigned;
    private Long workoutPlansAssigned;
    private Integer pendingDietRequests;
    private Double totalEarningsThisMonth;
    private Double rating;
    private Integer unreadMessages;
}
