package com.gymmanagement.commonservices.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class DietRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer requestId;

    @Column(nullable = false)
    private Integer memberId;

    @Column(nullable = false)
    private Integer trainerId;

    private String note;

    private LocalDateTime createdAt = LocalDateTime.now();
}
