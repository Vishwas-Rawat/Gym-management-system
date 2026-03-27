package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class MemberDashboardHomeDTO {
    private Integer streak;
    private Double caloriesConsumed;
    private Double caloriesTarget;
    private Boolean workoutCompleted; // today
    private String nextWorkoutName;
    private Double weight;
    private String quote;
}
