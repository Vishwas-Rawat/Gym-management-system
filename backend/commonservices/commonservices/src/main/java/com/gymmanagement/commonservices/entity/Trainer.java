package com.gymmanagement.commonservices.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "trainers")
public class Trainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer trainerId;

    private String specialization;

    private Integer experienceYears;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "gym_id", nullable = false)
    private Gym gym; 
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
}
