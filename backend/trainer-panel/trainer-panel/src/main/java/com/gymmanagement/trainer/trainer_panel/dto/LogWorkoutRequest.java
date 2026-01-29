package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class LogWorkoutRequest {
    private LocalDate date;
    private Long exerciseId;
    private Integer sets;
    private Integer reps;
    private Double weightKg;
}
