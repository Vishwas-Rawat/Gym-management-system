package com.gymmanagement.commonservices.entity;

import java.math.BigDecimal;
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
    private String category;

    @Column(name = "calories_per100g", nullable = false, precision = 8, scale = 2)
    private BigDecimal caloriesPer100g;

    @Column(name = "protein_per100g", nullable = false, precision = 8, scale = 2)
    private BigDecimal proteinPer100g = BigDecimal.ZERO;

    @Column(name = "carbs_per100g", nullable = false, precision = 8, scale = 2)
    private BigDecimal carbsPer100g = BigDecimal.ZERO;

    @Column(name = "fat_per100g", nullable = false, precision = 8, scale = 2)
    private BigDecimal fatPer100g = BigDecimal.ZERO;

    @Column(name = "fiber_per100g", precision = 8, scale = 2)
    private BigDecimal fiberPer100g = BigDecimal.ZERO;

    @Column(name = "serving_unit", length = 20)
    private String servingUnit = "100g";

    @Column(name = "is_indian")
    private Boolean isIndian = false;

    private Integer popularity = 0;
}
