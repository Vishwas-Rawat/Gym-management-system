package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Data;

@Data
public class WorkoutAssignSuccessResponse {
    private String message;
    private Integer planId;
    private Integer memberId;
    private Integer trainerId;
}
