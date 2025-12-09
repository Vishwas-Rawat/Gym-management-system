package com.gymmanagement.trainer.trainer_panel.dto.dashboard;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class InactiveMemberDTO {
    private Integer memberId;
    private String name;
    private LocalDate lastAttendance;
    private Long daysAbsent;
    private String phone;
}
