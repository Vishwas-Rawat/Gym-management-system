// src/main/java/com/gymmanagement/commonservices/entity/WorkoutPlanItem.java
package com.gymmanagement.commonservices.entity;

import com.gymmanagement.commonservices.enumeration.DayOfWeek;
import com.gymmanagement.commonservices.enumeration.ExerciseName;
import jakarta.persistence.*;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "workout_plan_items")
@Data
public class WorkoutPlanItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer itemId;

    @ManyToOne
    @JoinColumn(name = "plan_id", nullable = false)
    private WorkoutPlan workoutPlan;

    // @Enumerated(EnumType.STRING) -- Changed to String for custom exercises
    @Column(name = "exercise_name")
    private String exerciseName;

    private Integer sets;
    private Integer reps;
    private Integer restSeconds;
    private String notes;

    @ElementCollection
    @CollectionTable(name = "workout_days", joinColumns = @JoinColumn(name = "item_id"))
    @Enumerated(EnumType.STRING)
    private Set<DayOfWeek> days = new HashSet<>();
}