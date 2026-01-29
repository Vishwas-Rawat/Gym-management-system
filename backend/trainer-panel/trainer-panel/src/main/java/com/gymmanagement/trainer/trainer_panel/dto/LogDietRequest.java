package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class LogDietRequest {
    private LocalDate date;
    private String mealName; // "Breakfast", etc.
    private Long foodItemId;
    private Double quantity; // grams
}
