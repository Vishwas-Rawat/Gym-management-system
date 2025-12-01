package com.gymmanagement.trainer.trainer_panel.service;

import com.gymmanagement.commonservices.entity.ChatMessage;
import com.gymmanagement.trainer.trainer_panel.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository repo;

    public ChatMessage saveMessage(Integer sender, Integer receiver, String cipher) {

        System.out.println("🔥 ChatService.saveMessage CALLED");
        System.out.println("   Sender=" + sender + " Receiver=" + receiver + " Cipher=" + cipher);

        ChatMessage msg = new ChatMessage();
        msg.setSenderUserId(sender);
        msg.setReceiverUserId(receiver);
        msg.setCiphertext(cipher);
        msg.setCreatedAt(LocalDateTime.now());
        msg.setRead(false);

        ChatMessage saved = repo.save(msg);

        System.out.println("🔥 SAVED MESSAGE ID = " + saved.getMessageId());

        return saved;
    }

    public void markMessageRead(Long messageId) {
        repo.findById(messageId).ifPresent(m -> {
            m.setRead(true);
            m.setReadAt(LocalDateTime.now());
            repo.save(m);
        });
    }

    public ChatMessage getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public List<ChatMessage> getConversation(Integer userA, Integer userB) {

        var aToB = repo.findBySenderUserIdAndReceiverUserIdOrderByCreatedAtAsc(userA, userB);
        var bToA = repo.findBySenderUserIdAndReceiverUserIdOrderByCreatedAtAsc(userB, userA);

        aToB.addAll(bToA);

        // sort combined list
        aToB.sort((m1, m2) -> m1.getCreatedAt().compareTo(m2.getCreatedAt()));

        return aToB;
    }
    
    public void purgeOlderThan(LocalDateTime cutoff) {
        System.out.println("🧹 Purging messages older than: " + cutoff);

        var oldMessages = repo.findByCreatedAtBefore(cutoff);
        if (!oldMessages.isEmpty()) {
            System.out.println("🗑 Deleting " + oldMessages.size() + " old messages");
            repo.deleteAll(oldMessages);
        } else {
            System.out.println("🧹 No old messages found to delete");
        }
    }

}
