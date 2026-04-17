package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ActivityLogDTO {
    private String action;
    private LocalDateTime timestamp;
}
