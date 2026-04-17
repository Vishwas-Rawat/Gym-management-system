// src/main/java/com/gymmanagement/exercise/exercise_management/dto/WorkoutPlanResponse.java
package com.gymmanagement.exercise.exercise_management.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class WorkoutPlanResponse {
    private Integer planId;
    private String planName;
    private String trainerName;
    private String memberName;
    private LocalDateTime createdAt;
    private List<WorkoutItemResponse> exercises;
}