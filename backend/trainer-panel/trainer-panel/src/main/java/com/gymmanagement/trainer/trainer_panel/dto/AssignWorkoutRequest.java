package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Data;
import java.util.List;

@Data
public class AssignWorkoutRequest {

    private Integer memberId;   // 🔥 FIXED — now memberId, not userId
    private String planName;
    private List<WorkoutExerciseDto> exercises;
}
