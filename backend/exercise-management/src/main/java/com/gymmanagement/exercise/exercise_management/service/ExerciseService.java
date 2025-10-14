package com.gymmanagement.exercise.exercise_management.service;

import com.gymmanagement.exercise.exercise_management.dto.ExerciseRequest;
import com.gymmanagement.exercise.exercise_management.dto.ExerciseResponse;

import java.util.List;

public interface ExerciseService {

    ExerciseResponse addExercise(ExerciseRequest request);

    List<ExerciseResponse> getAllExercises();
}
