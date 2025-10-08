package com.gymmanagement.exercise.exercise_management.dto;

import com.gymmanagement.commonservices.enumeration.Equipment;
import com.gymmanagement.commonservices.enumeration.ExerciseName;
import com.gymmanagement.commonservices.enumeration.MuscleGroup;
import com.gymmanagement.commonservices.enumeration.Weight;
import lombok.Data;

@Data
public class ExerciseResponse {
    private Integer exerciseId;
    private MuscleGroup muscleGroup;
    private ExerciseName exerciseName;
    private Equipment equipment;
    private Weight weight;
    private Integer sets;
    private Integer reps;
    private Integer restTime;
    private String days;
    private Integer trainerId;  // ✅ Added
    private Integer userId;     // ✅ Added
}
