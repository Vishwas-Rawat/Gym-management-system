package com.gymmanagement.commonservices.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

import com.gymmanagement.commonservices.enumeration.MealName;

@Entity
@Table(name = "diet_meals")
@Data
public class DietMeal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer mealId;

    @ManyToOne
    @JoinColumn(name = "plan_id", nullable = false)
    private DietPlan dietPlan;

    @Enumerated(EnumType.STRING)
    private MealName mealName;

    @OneToMany(mappedBy = "meal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DietFood> foods = new ArrayList<>();

    @OneToOne(mappedBy = "meal", cascade = CascadeType.ALL, orphanRemoval = true)
    private DietProtein protein;

    @ElementCollection
    @CollectionTable(name = "diet_meal_days", joinColumns = @JoinColumn(name = "meal_id"))
    @Enumerated(EnumType.STRING)
    private java.util.Set<com.gymmanagement.commonservices.enumeration.DayOfWeek> days = new java.util.HashSet<>();
}
