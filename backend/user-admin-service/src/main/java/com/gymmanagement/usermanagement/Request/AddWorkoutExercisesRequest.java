package com.gymmanagement.usermanagement.Request;


import lombok.Data;
import java.util.List;

@Data
public class AddWorkoutExercisesRequest {
 private Integer planId;
 private List<ExerciseItem> exercises;

 @Data
 public static class ExerciseItem {
     private Integer exerciseId;
     private Integer sets;
     private Integer reps;
     private Integer durationSeconds;
     private Double weight;
     private Integer restTimeSeconds;
     private String description;
     private String dayOfWeek; // e.g., "Monday"
 }
}
