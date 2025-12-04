package com.gymmanagement.usermanagement.Request;

public record CreateCustomFoodRequest(
    String name,
    Double caloriesPer100g,
    Double proteinPer100g,
    Double carbsPer100g,
    Double fatPer100g,
    Double fiberPer100g,
    String servingUnit
) {}