// src/main/java/com/gymmanagement/exercise/exercise_management/dto/MemberDto.java
package com.gymmanagement.exercise.exercise_management.dto;

import lombok.Data;

@Data
public class MemberDto {
    private Integer memberId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String membershipPlan;
    private String profileImageUrl;
}