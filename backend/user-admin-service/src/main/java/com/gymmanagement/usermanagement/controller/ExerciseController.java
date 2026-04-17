package com.gymmanagement.usermanagement.controller;

import com.gymmanagement.commonservices.entity.MasterExercise;
import com.gymmanagement.usermanagement.service.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exercise")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;

    @GetMapping("/dictionary")
    public ResponseEntity<Map<String, List<Map<String, String>>>> getDictionary() {
        return ResponseEntity.ok(exerciseService.getExerciseDictionary());
    }

    @GetMapping("/search")
    public ResponseEntity<List<MasterExercise>> search(@RequestParam String query) {
        // userId can be null for global search
        return ResponseEntity.ok(exerciseService.searchExercises(query, null));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TRAINER')")
    public ResponseEntity<MasterExercise> addExercise(@RequestBody MasterExercise exercise) {
        return ResponseEntity.ok(exerciseService.addExercise(exercise, null));
    }
}
