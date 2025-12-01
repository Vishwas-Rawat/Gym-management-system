package com.gymmanagement.commonservices.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "diet_foods")
@Data
public class DietFood {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer foodId;

    @ManyToOne
    @JoinColumn(name = "meal_id", nullable = false)
    private DietMeal meal;

    private String foodName;
    private String quantity;
    private String notes;
}
