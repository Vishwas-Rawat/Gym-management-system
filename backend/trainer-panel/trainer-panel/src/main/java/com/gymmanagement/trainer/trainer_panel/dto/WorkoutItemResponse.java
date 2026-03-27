package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Data;

import java.util.List;

@Data
public class WorkoutItemResponse {
    private String exerciseName;
    private String displayName;
    private Integer sets;
    private Integer reps;
    private Integer restSeconds;
    private String notes;
    private List<String> days;
}
