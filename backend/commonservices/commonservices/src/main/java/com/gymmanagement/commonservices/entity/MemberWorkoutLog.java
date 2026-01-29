package com.gymmanagement.commonservices.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "member_workout_logs")
@Data
public class MemberWorkoutLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer memberId;

    @Column(nullable = false)
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "exercise_id", nullable = false)
    private MasterExercise exercise;

    private Integer sets;
    private Integer reps;
    private Double weightKg;
}
