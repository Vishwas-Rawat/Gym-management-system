package com.gymmanagement.trainer.trainer_panel.repository;

import com.gymmanagement.commonservices.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySenderUserIdAndReceiverUserIdOrderByCreatedAtAsc(Integer sender, Integer receiver);
    List<ChatMessage> findByReceiverUserIdAndSenderUserIdOrderByCreatedAtAsc(Integer receiver, Integer sender);
    List<ChatMessage> findByReceiverUserIdOrderByCreatedAtDesc(Integer receiver);
    List<ChatMessage> findByCreatedAtBefore(LocalDateTime cutoff);
    List<ChatMessage> findBySenderUserIdAndReceiverUserId(Integer sender, Integer receiver);
}
