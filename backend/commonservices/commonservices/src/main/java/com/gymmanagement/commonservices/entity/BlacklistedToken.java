// src/main/java/com/gymmanagement/commonservices/entity/BlacklistedToken.java
package com.gymmanagement.commonservices.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "blacklisted_tokens",
    indexes = @Index(name = "idx_token", columnList = "token"),
    uniqueConstraints = @UniqueConstraint(columnNames = "token")
)
@Data
public class BlacklistedToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2048) // JWT can be long
    private String token;

    @Column(nullable = false)
    private LocalDateTime blacklistedAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime expiresAt; // When the JWT would naturally expire
}