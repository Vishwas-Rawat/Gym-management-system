package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Data;

@Data
public class RequestCreateDto {
    private Integer memberId;   // required
    private Integer trainerId;  // required (frontend will pass trainer assigned to member or selected)
    private String message;     // optional
}
