package com.gymmanagement.commonservices.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "member_custom_foods")
@Data
public class CustomFoodItem {

 @Id @GeneratedValue
 private Long id;

 private Integer memberId;  // ← Only this member can see it

 @Column(nullable = false)
 private String name;

 @Column(nullable = false, precision = 8, scale = 2)
 private Double caloriesPer100g;

 @Column(nullable = false, precision = 8, scale = 2)
 private Double proteinPer100g;

 @Column(nullable = false, precision = 8, scale = 2)
 private Double carbsPer100g;

 @Column(nullable = false, precision = 8, scale = 2)
 private Double fatPer100g;

 @Column(precision = 8, scale = 2)
 private Double fiberPer100g = 0.0;

 @Column(length = 20)
 private String servingUnit = "100g";

 private LocalDateTime createdAt = LocalDateTime.now();
}