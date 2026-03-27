package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceMarkResponse {
    private Long id;         // saved attendance id
    private boolean marked;  // true if newly marked
    private String message;  // human message
}
