package com.gymmanagement.commonservices.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

import com.gymmanagement.commonservices.enumeration.RegistrationStatus;
import com.gymmanagement.commonservices.enumeration.Role;

@Data
@ToString(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email"),
        @UniqueConstraint(columnNames = "phone_number"),
        @UniqueConstraint(columnNames = "username")
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    @ToString.Include                    // SAFE field
    private Integer userId;

    @Column(nullable = false, unique = true)
    @ToString.Include                    // SAFE field
    private String email;

    @Column(name = "phone_number", unique = true)
    private String phoneNumber;

    @Column(name = "password_hash")
    private String password;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @ToString.Include                    // SAFE field
    private Role role;

    @Column(name = "username", unique = true)
    private String username;

    @Column(name = "is_active")
    private Boolean isActive = false;

    @Column(name = "is_email_verified")
    private Boolean isEmailVerified = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // ❌ EXCLUDE — Lazy collection -> cause of crash
    @OneToMany(mappedBy = "createdByAdmin", cascade = CascadeType.ALL)
    private List<Gym> gyms;

    @Column(name = "registration_token")
    private String registrationToken;

    @Column(name = "token_generated_at")
    private LocalDateTime tokenGeneratedAt;

    @Column(name = "registration_status")
    @Enumerated(EnumType.STRING)
    private RegistrationStatus registrationStatus = RegistrationStatus.PENDING;

    // ❌ EXCLUDE — Lazy fetch -> cause of LazyInitializationException
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private UserProfile userProfile;

    @PreUpdate
    public void setLastUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
