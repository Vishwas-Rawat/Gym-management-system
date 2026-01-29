package com.gymmanagement.commonservices.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_public_keys", uniqueConstraints = @UniqueConstraint(columnNames = "user_id"))
@Data
public class PublicKeyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Integer userId;

    @Column(name = "public_key", columnDefinition = "text", nullable = false)
    private String publicKeyPem; // e.g. base64/PEM format

    @Column(name = "encrypted_private_key", columnDefinition = "text")
    private String encryptedPrivateKey; // AES encrypted private key

    @Column(name = "updated_at")
    private java.time.LocalDateTime updatedAt = java.time.LocalDateTime.now();
}
