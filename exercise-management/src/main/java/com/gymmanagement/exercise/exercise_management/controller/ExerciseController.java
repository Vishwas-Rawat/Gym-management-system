package com.gymmanagement.exercise.exercise_management.controller;

import com.gymmanagement.exercise.exercise_management.dto.ExerciseRequest;
import com.gymmanagement.exercise.exercise_management.dto.ExerciseResponse;
import com.gymmanagement.exercise.exercise_management.service.ExerciseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/workout")
public class ExerciseController {

    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService) {
        this.exerciseService = exerciseService;
    }

    /**
     * ✅ One endpoint that can handle single or multiple exercises
     * - If request body is a single ExerciseRequest -> returns one ExerciseResponse
     * - If request body is a list of ExerciseRequest -> returns list of ExerciseResponse
     */
    @PostMapping("/addExercise")
    public ResponseEntity<?> addExercises(@RequestBody List<ExerciseRequest> requests) {
        if (requests.size() == 1) {
            // single
            return ResponseEntity.ok(exerciseService.addExercise(requests.get(0)));
        } else {
            // multiple
            List<ExerciseResponse> responses = requests.stream()
                    .map(exerciseService::addExercise)
                    .toList();
            return ResponseEntity.ok(responses);
        }
    }

    @GetMapping("/viewExercise")
    public ResponseEntity<List<ExerciseResponse>> getAllExercises() {
        return ResponseEntity.ok(exerciseService.getAllExercises());
    }
}
