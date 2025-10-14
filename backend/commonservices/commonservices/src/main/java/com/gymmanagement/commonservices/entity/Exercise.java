package com.gymmanagement.commonservices.entity;

import com.gymmanagement.commonservices.enumeration.*;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "exercises")
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer exerciseId;

    @Enumerated(EnumType.STRING)
    private MuscleGroup muscleGroup;

    @Enumerated(EnumType.STRING)
    @Column(name = "exercise_name")
    private ExerciseName exerciseName;

    @Enumerated(EnumType.STRING)
    private Equipment equipment;

    @Enumerated(EnumType.STRING)
    private Weight weight;

    private Integer sets;
    private Integer reps;

    @Column(name = "rest_time")
    private Integer restTime;

    private String days;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id", nullable = false)
    private Trainer trainer; // Assigned by trainer

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;   // Performed by member
}
