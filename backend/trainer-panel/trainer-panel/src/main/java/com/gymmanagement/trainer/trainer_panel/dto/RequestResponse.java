package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RequestResponse {
    private Integer requestId;
    private Integer memberId;
    private Integer trainerId;
    private String message;
    private LocalDateTime createdAt;
    private String status;
    private String memberName;
    private String type; // "DIET" or "WORKOUT"
}
