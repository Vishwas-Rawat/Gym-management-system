package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExerciseReferenceResponse {
    private String code; // Enum name e.g. BARBELL_BENCH_PRESS
    private String displayName; // "Barbell Bench Press"
    private String muscleGroup; // "Chest"
}
