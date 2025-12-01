// src/main/java/com/gymmanagement/commonservices/entity/Trainer.java

package com.gymmanagement.commonservices.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

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

    private String availability;
    private String email;
    private String fullName;
    private String phoneNo;
    private Double salary;
    private String status;

    // SOFT DELETE FIELDS (matches your DB)
    @Column(name = "deleted", nullable = false)
    private Boolean deleted = false;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}