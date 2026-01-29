package com.gymmanagement.commonservices.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "master_food_items")
@Data
public class MasterFoodItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // e.g., "Chicken Breast"

    @Column(nullable = true)
    private Integer createdByMemberId; // NULL = Global, Value = Private to Member

    @Column(nullable = false)
    private Double caloriesPer100g;

    @Column(nullable = false)
    private Double proteinPer100g;

    @Column(nullable = false)
    private Double carbsPer100g;

    @Column(nullable = false)
    private Double fatPer100g;

    @Column(nullable = false)
    private String servingUnit; // e.g., "grams", "ml"
}
