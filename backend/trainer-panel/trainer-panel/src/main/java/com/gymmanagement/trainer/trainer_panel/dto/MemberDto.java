// src/main/java/com/gymmanagement/trainer/trainer_panel/dto/MemberDto.java
package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Data;

@Data
public class MemberDto {
    private Integer memberId;
    private Integer userId;
    private String firstName;
    private String lastName;
    private String email;
    private Long gymId;
    private String membershipPlan;
}
