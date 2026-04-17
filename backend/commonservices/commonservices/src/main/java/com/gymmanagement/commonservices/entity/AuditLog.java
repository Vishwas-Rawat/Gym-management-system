package com.gymmanagement.commonservices.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "audit_logs", indexes = {
    @Index(name = "idx_audit_action", columnList = "action"),
    @Index(name = "idx_audit_entity", columnList = "entity_type"),
    @Index(name = "idx_audit_admin", columnList = "performed_by_admin_id")
})
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String action; // e.g., "ADD", "DELETE", "UPDATE"

    @Column(name = "entity_type", nullable = false)
    private String entityType; // e.g., "MEMBER", "TRAINER", "GYM"

    @Column(name = "entity_id")
    private String entityId;

    @Column(name = "performed_by_admin_id", nullable = false)
    private Integer performedByAdminId;

    @Column(name = "performed_by_admin_email")
    private String performedByAdminEmail;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
}
