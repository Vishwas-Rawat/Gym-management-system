package com.gymmanagement.exercise.exercise_management.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class AssignWorkoutRequest {

    @JsonProperty("userId")   // ⭐ forces JSON to map correctly
    private Integer userId;

    private String planName;
    private List<WorkoutExerciseDto> exercises;
}
