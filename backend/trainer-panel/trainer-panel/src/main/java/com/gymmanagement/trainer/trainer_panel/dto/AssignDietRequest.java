package com.gymmanagement.trainer.trainer_panel.dto;

import com.gymmanagement.commonservices.enumeration.DietType;
import lombok.Data;

import java.util.List;

@Data
public class AssignDietRequest {
    private String planName;
    private Integer memberId;
    private DietType dietType;
    private String strategy; // "REPLACE" or "APPEND"
    private List<MealDto> meals;
}
