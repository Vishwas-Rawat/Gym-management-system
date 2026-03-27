package com.gymmanagement.commonservices.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(
        name = "gym",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"gym_name", "address", "city", "created_by_admin"})
        }
)
public class Gym {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "gym_id")
    private Long gymId;

    @Column(name = "gym_name", nullable = false)
    private String gymName;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    private String state;
    private String contactNumber;
    private String email;
    private String openingHours;

    // ❗ Avoid infinite loop: Admin(User) ↔ Gym ↔ Member ↔ Gym loop
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_admin", nullable = false)
    @JsonBackReference
    private User createdByAdmin;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    private Boolean isActive = true;

    @PreUpdate
    public void setLastUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
