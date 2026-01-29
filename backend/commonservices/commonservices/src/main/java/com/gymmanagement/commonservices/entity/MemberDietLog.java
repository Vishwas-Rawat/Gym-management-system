package com.gymmanagement.commonservices.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "member_diet_logs")
@Data
public class MemberDietLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer memberId;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private String mealName; // Breakfast, Lunch, Dinner, Snack

    @ManyToOne
    @JoinColumn(name = "food_item_id", nullable = false)
    private MasterFoodItem foodItem;

    @Column(nullable = false)
    private Double quantity; // in grams/ml

    // Calculated values (persisted for easier querying/history even if master
    // changes)
    private Double totalCalories;
    private Double totalProtein;
    private Double totalCarbs;
    private Double totalFat;
}
