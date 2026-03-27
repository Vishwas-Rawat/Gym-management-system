package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Data;

@Data
public class DietLogRequest {
    private String mealName;
    private String foodName;
    private Double quantity;
    private Double calories;
    private Double protein;
    private Double carbs;
    private Double fat;
}
