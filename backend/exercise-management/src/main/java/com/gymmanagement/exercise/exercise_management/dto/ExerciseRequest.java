package com.gymmanagement.exercise.exercise_management.dto;

import com.gymmanagement.commonservices.enumeration.Equipment;
import com.gymmanagement.commonservices.enumeration.ExerciseName;
import com.gymmanagement.commonservices.enumeration.MuscleGroup;
import com.gymmanagement.commonservices.enumeration.Weight;
import lombok.Data;

@Data
public class ExerciseRequest {
    private MuscleGroup muscleGroup;
    private ExerciseName exerciseName;
    private Equipment equipment;
    private Weight weight;

    private Integer sets;
    private Integer reps;
    private Integer restTime;   // in seconds
    private String days;        // e.g. "MON,WED,FRI"

    private Integer trainerId;  // added
    private Integer userId;     // added
}
