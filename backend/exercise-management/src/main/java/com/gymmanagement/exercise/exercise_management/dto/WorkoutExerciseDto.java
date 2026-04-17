// src/main/java/com/gymmanagement/exercise/exercise_management/dto/WorkoutExerciseDto.java
package com.gymmanagement.exercise.exercise_management.dto;

import com.gymmanagement.commonservices.enumeration.ExerciseName;
import lombok.Data;
import java.util.List;

@Data
public class WorkoutExerciseDto {
    private ExerciseName exerciseName;
    private Integer sets;
    private Integer reps;
    private Integer restSeconds;
    private String notes;
    private List<String> days; // ["MONDAY", "WEDNESDAY"]
}