package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AdminAttendanceUpdateRequest {
    private Integer userId;
    private LocalDate date;
    private String status; // "PRESENT" or "ABSENT"
}
