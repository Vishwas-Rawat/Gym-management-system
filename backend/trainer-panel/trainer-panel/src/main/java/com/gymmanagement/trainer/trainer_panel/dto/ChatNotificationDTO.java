package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatNotificationDTO {
    private Long messageId;
    private Integer fromUserId;
    private String ciphertext;     // still encrypted
    private LocalDateTime createdAt;
}
