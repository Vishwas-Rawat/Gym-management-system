package com.gymmanagement.trainer.trainer_panel.service;

import com.gymmanagement.commonservices.entity.ChatMessage;
import com.gymmanagement.trainer.trainer_panel.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository repo;
    private final com.gymmanagement.trainer.trainer_panel.repository.PublicKeyRepository publicKeyRepo;

    public void syncKeys(Integer userId, String publicKey, String encryptedPrivate) {
        var entity = publicKeyRepo.findByUserId(userId)
                .orElse(new com.gymmanagement.commonservices.entity.PublicKeyEntity());
        entity.setUserId(userId);
        entity.setPublicKeyPem(publicKey);
        entity.setEncryptedPrivateKey(encryptedPrivate);
        entity.setUpdatedAt(java.time.LocalDateTime.now());
        publicKeyRepo.save(entity);
    }

    public com.gymmanagement.commonservices.entity.PublicKeyEntity getKeys(Integer userId) {
        return publicKeyRepo.findByUserId(userId).orElse(null);
    }

    public void resetKeys(Integer userId) {
        publicKeyRepo.findByUserId(userId).ifPresent(publicKeyRepo::delete);
    }

    public ChatMessage saveMessage(Integer sender, Integer receiver, String cipher, String senderCipher) {

        System.out.println("🔥 ChatService.saveMessage CALLED");
        System.out.println("   Sender=" + sender + " Receiver=" + receiver + " Cipher=" + cipher);

        ChatMessage msg = new ChatMessage();
        msg.setSenderUserId(sender);
        msg.setReceiverUserId(receiver);
        msg.setCiphertext(cipher);
        msg.setSenderCiphertext(senderCipher); // Set the sender's copy
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
        // Fallback to unpaginated (limited to 100 recent)
        return repo.findConversation(userA, userB, org.springframework.data.domain.PageRequest.of(0, 100))
                .getContent();
    }

    public Page<ChatMessage> getConversationPaginated(Integer userA, Integer userB, Pageable pageable) {
        return repo.findConversation(userA, userB, pageable);
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
