package com.gymmanagement.commonservices.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "workout_plan_items")
public class WorkoutPlanItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer itemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    private WorkoutPlan workoutPlan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;
}
