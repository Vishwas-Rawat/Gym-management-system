package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Data;
import java.util.List;

@Data
public class AdminGymAttendanceDTO {
    private Integer gymId;
    private List<AttendanceResponseDTO> records;
}
