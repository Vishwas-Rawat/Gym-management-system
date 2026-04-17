package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MemberDashboardSummaryDTO {
    private boolean hasTrainer;
    private String trainerName;
    private Long pendingWorkoutRequests;
    private Long pendingDietRequests;
    private int todayWorkoutLogsCount;
    private int todayDietLogsCount;
    private WorkoutPlanResponse latestWorkoutPlan;
    private DietPlanResponse latestDietPlan;
}
