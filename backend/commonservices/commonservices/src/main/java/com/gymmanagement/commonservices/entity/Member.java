package com.gymmanagement.commonservices.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "members")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer memberId;

    // ❗ Prevent recursion into User → Gym/Trainer → Member loop
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
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
    private String fromPeriod;

    @Column(name = "to_hour")
    private Integer toHour;

    @Column(name = "to_minute")
    private String toMinute;

    @Column(name = "to_period")
    private String toPeriod;

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

    @Column(name = "plan_start_date")
    private LocalDate planStartDate;

    @Column(name = "joining_date", nullable = false)
    private LocalDate joiningDate;

    // Optional Fields
    private String fitnessGoal;
    private String membershipPlan;
    private Double amountPaid;
    private String workoutTimeSlot;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    // ❗ Prevent recursion into Gym → Admin(User) → Member → Gym
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "gym_id", nullable = false)
    @JsonBackReference
    private Gym gym;

    // ❗ Prevent recursion into Trainer → Members → Trainer
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id")
    @JsonIgnore
    private Trainer trainer;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
