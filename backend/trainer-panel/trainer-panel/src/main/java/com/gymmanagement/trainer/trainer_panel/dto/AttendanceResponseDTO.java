package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AttendanceResponseDTO {
    private Long id;
    private Integer userId;
    private String role;
    private LocalDate date;
    private String status;
}
