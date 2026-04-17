package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Data;
import java.util.List;

@Data
public class MealResponse {
    private String mealName;
    private List<FoodDto> foods;
    private ProteinDto protein;
    private List<String> days; // 🗓️ Added for day-wise support
}
