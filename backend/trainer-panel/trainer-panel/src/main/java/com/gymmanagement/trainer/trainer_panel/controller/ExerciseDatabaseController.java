package com.gymmanagement.trainer.trainer_panel.controller;

import com.gymmanagement.commonservices.entity.MasterExercise;
import com.gymmanagement.trainer.trainer_panel.service.WorkoutLogService;
import com.gymmanagement.trainer.trainer_panel.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/workout/exercise")
@RequiredArgsConstructor
public class ExerciseDatabaseController {

    private final WorkoutLogService service;
    private final MemberRepository memberRepo;

    private Integer getMemberIdOrNull(java.security.Principal principal) {
        if (principal instanceof com.gymmanagement.trainer.trainer_panel.security.MemberPrincipal mp) {
            return memberRepo.findByUser_UserId(mp.userId())
                    .orElseThrow(() -> new IllegalArgumentException("Member not found")).getMemberId();
        }
        return null;
    }

    @GetMapping("/search")
    public ResponseEntity<Page<MasterExercise>> search(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            java.security.Principal principal) {
        Integer memberId = getMemberIdOrNull(principal);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.searchExercises(query, memberId, pageable));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('MEMBER', 'TRAINER', 'ADMIN')")
    public ResponseEntity<MasterExercise> addExercise(@RequestBody MasterExercise ex,
            java.security.Principal principal) {
        Integer memberId = getMemberIdOrNull(principal);
        return ResponseEntity.ok(service.addExerciseToDatabase(ex, memberId));
    }

    // ⭐ NEW: Dictionary for Frontend (Merged Enum + DB)
    @GetMapping("/dictionary")
    public ResponseEntity<?> getDictionary() {
        java.util.Map<String, java.util.List<ExerciseOption>> dictionary = new java.util.HashMap<>();

        // 1. Load Hardcoded Values
        for (com.gymmanagement.commonservices.enumeration.ExerciseName e : com.gymmanagement.commonservices.enumeration.ExerciseName
                .values()) {
            dictionary.computeIfAbsent(e.getMuscleGroup(), k -> new java.util.ArrayList<>())
                    .add(new ExerciseOption(e.name(), e.getDisplayName()));
        }

        // 2. Load Global DB Values
        List<MasterExercise> globalExercises = service.getAllGlobalExercises();
        for (MasterExercise ex : globalExercises) {
            String group = (ex.getTargetMuscleGroup() != null) ? ex.getTargetMuscleGroup() : "Custom";
            dictionary.computeIfAbsent(group, k -> new java.util.ArrayList<>())
                    .add(new ExerciseOption(ex.getName(), ex.getName())); // Use Name as Code
        }

        return ResponseEntity.ok(dictionary);
    }

    private record ExerciseOption(String code, String displayName) {
    }
}
