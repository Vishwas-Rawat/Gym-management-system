package com.gymmanagement.usermanagement.Response;

import lombok.Data;

@Data
public class TrainerActivityDTO {
    private Integer trainerId;
    private String fullName;
    private long memberCount;
}
