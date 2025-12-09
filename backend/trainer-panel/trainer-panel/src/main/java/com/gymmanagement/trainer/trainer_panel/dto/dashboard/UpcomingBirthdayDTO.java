package com.gymmanagement.trainer.trainer_panel.dto.dashboard;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class UpcomingBirthdayDTO {
    private Integer memberId;
    private String name;
    private LocalDate birthday;
    private Long daysUntil;
}
