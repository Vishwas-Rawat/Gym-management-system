package com.gymmanagement.trainer.trainer_panel.repository;

import com.gymmanagement.commonservices.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
  List<ChatMessage> findBySenderUserIdAndReceiverUserIdOrderByCreatedAtAsc(Integer sender, Integer receiver);

  List<ChatMessage> findByReceiverUserIdAndSenderUserIdOrderByCreatedAtAsc(Integer receiver, Integer sender);

  List<ChatMessage> findByReceiverUserIdOrderByCreatedAtDesc(Integer receiver);

  List<ChatMessage> findByCreatedAtBefore(LocalDateTime cutoff);

  List<ChatMessage> findBySenderUserIdAndReceiverUserId(Integer sender, Integer receiver);

  @Query("SELECT m FROM ChatMessage m WHERE m.receiverUserId = :trainerUserId AND m.read = false")
  List<ChatMessage> findUnreadMessagesForTrainer(@Param("trainerUserId") Integer trainerUserId);

  @Query("SELECT m FROM ChatMessage m WHERE (m.senderUserId = :u1 AND m.receiverUserId = :u2) " +
      "OR (m.senderUserId = :u2 AND m.receiverUserId = :u1) " +
      "ORDER BY m.createdAt DESC")
  Page<ChatMessage> findConversation(@Param("u1") Integer u1, @Param("u2") Integer u2, Pageable pageable);
}
