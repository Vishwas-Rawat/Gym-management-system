package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Data;

@Data
public class WorkoutLogRequest {
    private String exerciseName;
    private Integer setsCount;
    private Integer repsCount;
    private Double weight;
    private Integer durationMinutes;
    private Boolean completed;
}
