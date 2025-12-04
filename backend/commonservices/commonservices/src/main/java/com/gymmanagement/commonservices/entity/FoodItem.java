package com.gymmanagement.commonservices.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "food_items", indexes = {
    @Index(name = "idx_food_name", columnList = "name"),
    @Index(name = "idx_popularity", columnList = "popularity DESC")
})
@Data
public class FoodItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 50)
    private String category; // Protein, Carb, Vegetable, etc.

    @Column(nullable = false, precision = 8, scale = 2)
    private Double caloriesPer100g;

    @Column(nullable = false, precision = 8, scale = 2)
    private Double proteinPer100g = 0.0;

    @Column(nullable = false, precision = 8, scale = 2)
    private Double carbsPer100g = 0.0;

    @Column(nullable = false, precision = 8, scale = 2)
    private Double fatPer100g = 0.0;

    @Column(precision = 8, scale = 2)
    private Double fiberPer100g = 0.0;

    @Column(length = 20)
    private String servingUnit = "100g"; // 100g, 1 piece, 1 bowl

    private Boolean isIndian = false;

    private Integer popularity = 0; // for search ranking
}