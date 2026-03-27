package com.gymmanagement.usermanagement.Response;

import lombok.Data;

@Data
public class FoodSearchResponse {
    private Long id;
    private String name;
    private String category;
    private Double caloriesPer100g;
    private Double proteinPer100g;
    private Double carbsPer100g;
    private Double fatPer100g;
    private Double fiberPer100g;
    private String servingUnit;
    private String type; // "GLOBAL" or "CUSTOM"
}