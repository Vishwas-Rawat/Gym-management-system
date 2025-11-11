// src/main/java/com/gymmanagement/commonservices/entity/Member.java
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
    private User user;

    @Column(name = "months_paid", nullable = false)
    private Integer monthsPaid;

    @Column(name = "months_free")
    private Integer monthsFree = 0;

    @Column(name = "from_hour")
    private Integer fromHour;

    @Column(name = "from_minute")
    private String fromMinute;

    @Column(name = "from_period")
    private String fromPeriod; // AM/PM

    @Column(name = "to_hour")
    private Integer toHour;

    @Column(name = "to_minute")
    private String toMinute;

    @Column(name = "to_period")
    private String toPeriod; // AM/PM

    @Column(name = "registration_fee")
    private Double registrationFee = 0.0;

    @Column(name = "plan_price")
    private Double planPrice = 0.0;

    @Column(name = "discount")
    private Double discount = 0.0;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

 // With this (use joiningDate)
    @Column(name = "joining_date", nullable = false)
    private LocalDate joiningDate;

    // === LEGACY / ADDITIONAL FIELDS ===
    private String fitnessGoal;
    private String membershipPlan;
    private Double amountPaid;
    private String workoutTimeSlot;

    // === REQUIRED FIELDS (DO NOT REMOVE) ===
    @Column(name = "created_at", nullable = false, updatable = false)
    @org.hibernate.annotations.CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    @org.hibernate.annotations.UpdateTimestamp
    private LocalDateTime updatedAt;

    // === RELATIONSHIPS ===
    @ManyToOne
    @JoinColumn(name = "gym_id", nullable = false)
    private Gym gym;

    // === SOFT DELETE ===
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}