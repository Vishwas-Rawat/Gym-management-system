package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Data;

@Data
public class MemberSummaryDTO {
    private Integer memberId;
    private Integer userId;
    private String fullName;
    private String email;
}
