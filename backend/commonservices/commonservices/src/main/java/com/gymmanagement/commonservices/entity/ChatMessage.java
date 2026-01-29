package com.gymmanagement.commonservices.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Data
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long messageId;

    // user IDs (users table)
    @Column(nullable = false)
    private Integer senderUserId;

    @Column(nullable = false)
    private Integer receiverUserId;

    @Column(nullable = false, columnDefinition = "text")
    private String ciphertext; // encrypted payload for receiver

    @Column(columnDefinition = "text")
    private String senderCiphertext; // encrypted payload for sender (new)

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private Boolean read = false;

    @Column
    private LocalDateTime readAt;
}
