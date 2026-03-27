package com.gymmanagement.trainer.trainer_panel.dto.dashboard;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TodayAttendanceDTO {
    private Integer memberId;
    private String name;
    private String checkInTime;
    private boolean workoutLogged;
    private boolean dietLogged;
}
