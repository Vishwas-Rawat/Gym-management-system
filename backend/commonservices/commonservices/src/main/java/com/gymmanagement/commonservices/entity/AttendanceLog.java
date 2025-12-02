package com.gymmanagement.commonservices.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(
    name = "attendance_logs",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "date"})
)
@Data
public class AttendanceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(nullable = false)
    private String role;  // TRAINER or MEMBER

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private String status = "PRESENT";
}
