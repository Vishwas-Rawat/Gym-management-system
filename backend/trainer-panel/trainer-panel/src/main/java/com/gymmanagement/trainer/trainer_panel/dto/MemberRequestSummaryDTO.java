package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MemberRequestSummaryDTO {
    private Integer memberId;
    private String fullName;
    private long pendingWorkoutRequests;
    private long pendingDietRequests;
}
