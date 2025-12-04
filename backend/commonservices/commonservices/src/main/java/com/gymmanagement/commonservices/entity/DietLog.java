package com.gymmanagement.commonservices.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

//DietLog.java
@Entity
@Table(name = "diet_logs")
@Data
public class DietLog {
 @Id @GeneratedValue
 private Long logId;

 private Integer memberId;
 private LocalDate date;
 private String mealName; // BREAKFAST, LUNCH, etc.

 private Long foodId;
 private String foodName;
 private Double quantity; // in grams
 private Double calories;
 private Double protein;
 private Double carbs;
 private Double fat;

 private LocalDateTime loggedAt = LocalDateTime.now();
}