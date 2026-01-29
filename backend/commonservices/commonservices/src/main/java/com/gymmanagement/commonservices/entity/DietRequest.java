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

    @Column(nullable = true)
    private Integer trainerId;

    private String note;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private com.gymmanagement.commonservices.enumeration.RequestStatus status = com.gymmanagement.commonservices.enumeration.RequestStatus.PENDING;

    private LocalDateTime createdAt = LocalDateTime.now();
}
