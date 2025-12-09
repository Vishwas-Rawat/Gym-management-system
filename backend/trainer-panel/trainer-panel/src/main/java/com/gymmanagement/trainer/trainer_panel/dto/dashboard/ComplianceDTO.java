package com.gymmanagement.trainer.trainer_panel.dto.dashboard;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ComplianceDTO {
    private Integer todayLogged;
    private Integer totalMembers;
    private Integer compliancePercent;
    private List<String> topPerformers;
    private String message;
}
