package com.gymmanagement.commonservices.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "master_exercises")
@Data
public class MasterExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // e.g., "Bench Press"

    @Column(nullable = false)
    private String targetMuscleGroup; // Chest, Back, Legs...

    @Column(nullable = true)
    private Integer createdByMemberId; // NULL = Global, Value = Private
}
