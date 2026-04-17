package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class WorkoutPlanResponse {
    private Integer planId;
    private String planName;

    private Integer trainerId;   // ✅ Add
    private Integer memberId;    // ✅ Add

    private String trainerName;  // Optional — keep if needed
    private String memberName;   // Optional — keep if needed

    private LocalDateTime createdAt;
    private List<WorkoutItemResponse> exercises;
}
