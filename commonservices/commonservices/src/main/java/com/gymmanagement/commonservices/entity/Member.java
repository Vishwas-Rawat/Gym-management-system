package com.gymmanagement.commonservices.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Entity
@Table(name = "members")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer memberId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user; // Linked to base User

    private String fitnessGoal;
    private String membershipPlan; // monthly, quarterly, annual
    private LocalDate joiningDate;
    private Double amountPaid;
    private String paymentMethod;
    private String workoutTimeSlot;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @ManyToOne
    @JoinColumn(name = "gym_id", nullable = false)
    private Gym gym;
}
