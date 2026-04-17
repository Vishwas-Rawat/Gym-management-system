package com.gymmanagement.trainer.trainer_panel.dto;

import com.gymmanagement.commonservices.enumeration.MealName;
import lombok.Data;

import java.util.List;

@Data
public class MealDto {
    private MealName mealName;
    private List<FoodDto> foods;
    private ProteinDto protein; // optional
    private List<String> days; // 🗓️ Added for day-wise support
}
