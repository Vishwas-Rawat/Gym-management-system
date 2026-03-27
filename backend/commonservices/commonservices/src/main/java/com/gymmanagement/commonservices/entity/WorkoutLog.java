package com.gymmanagement.commonservices.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "workout_logs")
@Data
public class WorkoutLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;

    private Integer memberId;
    private LocalDate date;

    private String exerciseName;
    private Integer setsCount;
    private Integer repsCount;
    private Double weight;
    private Integer durationMinutes; // for cardio

    private Boolean completed;

    private LocalDateTime loggedAt = LocalDateTime.now();
}
