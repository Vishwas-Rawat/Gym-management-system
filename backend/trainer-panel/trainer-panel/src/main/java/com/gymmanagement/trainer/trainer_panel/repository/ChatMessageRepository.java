package com.gymmanagement.trainer.trainer_panel.repository;

import com.gymmanagement.commonservices.entity.ChatMessage;

import feign.Param;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySenderUserIdAndReceiverUserIdOrderByCreatedAtAsc(Integer sender, Integer receiver);
    List<ChatMessage> findByReceiverUserIdAndSenderUserIdOrderByCreatedAtAsc(Integer receiver, Integer sender);
    List<ChatMessage> findByReceiverUserIdOrderByCreatedAtDesc(Integer receiver);
    List<ChatMessage> findByCreatedAtBefore(LocalDateTime cutoff);
    List<ChatMessage> findBySenderUserIdAndReceiverUserId(Integer sender, Integer receiver);
    @Query("""
    	    SELECT m FROM ChatMessage m 
    	    WHERE m.receiverUserId = :trainerUserId 
    	      AND m.read = false
    	    """)
    	List<ChatMessage> findUnreadMessagesForTrainer(@Param("trainerUserId") Integer trainerUserId);

}
