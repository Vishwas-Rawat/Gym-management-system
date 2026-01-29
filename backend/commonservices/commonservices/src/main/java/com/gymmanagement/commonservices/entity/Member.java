package com.gymmanagement.commonservices.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Entity
@Table(name = "members", uniqueConstraints = @UniqueConstraint(columnNames = { "user_id", "gym_id" }))
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer memberId;

    // ✅ Changed to ManyToOne for Multi-Gym Support
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false) // Removed unique=true
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

    @Column(name = "plan_start_date")
    private LocalDate planStartDate;

    @Column(name = "joining_date", nullable = false)
    private LocalDate joiningDate;

    // === Legacy / Optional Fields ===
    private String fitnessGoal;
    private String membershipPlan;
    private Double amountPaid;
    private String workoutTimeSlot;

    // === Replace Hibernate timestamps with pure JPA ===

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    // === Relationships ===
    @ManyToOne
    @JoinColumn(name = "gym_id", nullable = false)
    private Gym gym;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trainer_id")
    private Trainer trainer;

    // === Soft Delete ===
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    // === Auto-update updatedAt manually ===
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
