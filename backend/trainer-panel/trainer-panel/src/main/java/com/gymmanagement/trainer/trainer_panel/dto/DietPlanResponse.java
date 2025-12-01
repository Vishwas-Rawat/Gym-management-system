package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class DietPlanResponse {
    private Integer planId;
    private String planName;
    private Integer memberId;
    private Integer trainerId;
    private String trainerName;
    private String memberName;
    private String dietType;
    private LocalDateTime createdAt;
    private List<MealResponse> meals;
}
