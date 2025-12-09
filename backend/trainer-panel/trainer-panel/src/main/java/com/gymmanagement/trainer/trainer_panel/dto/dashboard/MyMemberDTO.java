package com.gymmanagement.trainer.trainer_panel.dto.dashboard;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class MyMemberDTO {
    private Integer memberId;
    private String name;
    private String phone;
    private String photo;
    private String plan;
    private LocalDate lastAttendance;
    private Long daysSinceLastVisit;
    private boolean hasActiveDietPlan;
    private boolean hasActiveWorkoutPlan;
}
