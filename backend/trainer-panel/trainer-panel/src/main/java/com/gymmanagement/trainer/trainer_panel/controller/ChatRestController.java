package com.gymmanagement.trainer.trainer_panel.controller;

import com.gymmanagement.commonservices.entity.PublicKeyEntity;
import com.gymmanagement.trainer.trainer_panel.repository.PublicKeyRepository;
import com.gymmanagement.trainer.trainer_panel.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequiredArgsConstructor
public class ChatRestController {

    private final PublicKeyRepository keyRepo;
    private final ChatService chatService;
    private final com.gymmanagement.trainer.trainer_panel.client.UserManagementClient userClient;

    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam String query) {
        try {
            return ResponseEntity.ok(userClient.searchUsers(query));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error searching users: " + e.getMessage());
        }
    }

    @PostMapping("/keys")
    public ResponseEntity<?> uploadPublicKey(@RequestBody PublicKeyEntity dto) {
        // dto.userId and dto.publicKeyPem expected
        var existing = keyRepo.findByUserId(dto.getUserId());
        if (existing.isPresent()) {
            var entity = existing.get();
            entity.setPublicKeyPem(dto.getPublicKeyPem());
            entity.setUpdatedAt(LocalDateTime.now());
            keyRepo.save(entity);
        } else {
            dto.setUpdatedAt(LocalDateTime.now());
            keyRepo.save(dto);
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/keys/{userId}")
    public ResponseEntity<?> getPublicKey(@PathVariable Integer userId) {
        return keyRepo.findByUserId(userId)
                .map(pk -> ResponseEntity.ok(pk.getPublicKeyPem()))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/history/{otherUserId}")
    public ResponseEntity<?> getConversation(org.springframework.security.core.Authentication authentication,
            @PathVariable Integer otherUserId) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Integer authUserId = extractUserId(authentication);
        var conv = chatService.getConversation(authUserId, otherUserId);
        return ResponseEntity.ok(conv);
    }

    @PostMapping("/read/{messageId}")
    public ResponseEntity<?> markRead(@PathVariable Long messageId) {
        chatService.markMessageRead(messageId);
        return ResponseEntity.ok().build();
    }

    private Integer extractUserId(org.springframework.security.core.Authentication auth) {
        Object p = auth.getPrincipal();
        if (p instanceof com.gymmanagement.trainer.trainer_panel.security.TrainerPrincipal tp) {
            return tp.userId();
        }
        if (p instanceof com.gymmanagement.trainer.trainer_panel.security.MemberPrincipal mp) {
            return mp.userId();
        }
        if (p instanceof com.gymmanagement.trainer.trainer_panel.security.AdminPrincipal ap) {
            return ap.userId();
        }
        throw new RuntimeException("Unknown principal type: " + p.getClass().getName());
    }
}
