package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Data;

import java.util.List;

@Data
public class WorkoutExerciseDto {
    private String exerciseName; // must match commonservices.enumeration.ExerciseName enum name
    private Integer sets;
    private Integer reps;
    private Integer restSeconds;
    private String notes;
    private List<String> days;   // e.g. ["MONDAY","WEDNESDAY"]
}
