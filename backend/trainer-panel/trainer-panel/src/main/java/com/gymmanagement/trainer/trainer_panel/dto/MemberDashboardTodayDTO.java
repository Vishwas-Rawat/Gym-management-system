package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import com.gymmanagement.commonservices.entity.DietLog;
import com.gymmanagement.commonservices.entity.WorkoutLog;

@Data
@Builder
public class MemberDashboardTodayDTO {
    private List<DietLog> dietLogs;
    private List<WorkoutLog> workoutLogs;
    private Boolean attendanceMarked;
    private Double caloriesConsumed;
    private Double proteinConsumed;
    private Double carbsConsumed;
    private Double fatConsumed;
}
