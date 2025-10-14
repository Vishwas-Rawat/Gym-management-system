package com.gymmanagement.exercise.exercise_management.dto;

import lombok.Data;
import java.util.List;

@Data
public class WorkoutPlanResponse {
    private Integer planId;
    private String planName;
    private Integer memberId;
    private List<Integer> exerciseIds;
}
