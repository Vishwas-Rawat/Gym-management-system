// src/main/java/com/gymmanagement/commonservices/entity/WorkoutPlan.java
package com.gymmanagement.commonservices.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workout_plans")
@Data
public class WorkoutPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer planId;

    @Column(name = "plan_name")
    private String planName;

    @Column(name = "member_id")
    private Integer memberId;

    @Column(name = "trainer_id")
    private Integer trainerId;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "workoutPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorkoutPlanItem> items = new ArrayList<>();
}