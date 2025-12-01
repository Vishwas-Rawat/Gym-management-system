package com.gymmanagement.commonservices.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

import com.gymmanagement.commonservices.enumeration.DietType;

@Entity
@Table(name = "diet_plans")
@Data
public class DietPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer planId;

    private String planName;

    @Column(name = "member_id")
    private Integer memberId;

    @Column(name = "trainer_id")
    private Integer trainerId;

    @Enumerated(EnumType.STRING)
    private DietType dietType;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "dietPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<DietMeal> meals = new java.util.ArrayList<>();
}
