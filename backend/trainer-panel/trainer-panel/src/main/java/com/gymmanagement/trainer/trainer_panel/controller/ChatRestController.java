package com.gymmanagement.trainer.trainer_panel.controller;

import com.gymmanagement.trainer.trainer_panel.security.AdminPrincipal;
import com.gymmanagement.trainer.trainer_panel.security.MemberPrincipal;
import com.gymmanagement.trainer.trainer_panel.security.TrainerPrincipal;
import com.gymmanagement.trainer.trainer_panel.service.ChatService;
import com.gymmanagement.trainer.trainer_panel.service.ContactService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatRestController {

    private final ChatService chatService;
    private final ContactService contactService;

    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam String query, Authentication auth) {
        Integer userId = extractUserId(auth);
        String role = extractRole(auth);
        return ResponseEntity.ok(contactService.searchContacts(userId, role, query));
    }

    @GetMapping("/contacts")
    public ResponseEntity<?> getContacts(Authentication auth) {
        Integer userId = extractUserId(auth);
        String role = extractRole(auth);
        return ResponseEntity.ok(contactService.getContacts(userId, role));
    }

    @PostMapping("/sync-keys")
    public ResponseEntity<?> syncKeys(@RequestBody KeySyncRequest request, Authentication auth) {
        Integer userId = extractUserId(auth);
        chatService.syncKeys(userId, request.getPublicKey(), request.getEncryptedPrivateKey());
        return ResponseEntity.ok(Map.of("message", "Keys synced successfully"));
    }

    @GetMapping("/sync-keys")
    public ResponseEntity<?> getKeys(Authentication auth) {
        Integer userId = extractUserId(auth);
        var keys = chatService.getKeys(userId);
        if (keys == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(Map.of(
                "publicKey", keys.getPublicKeyPem(),
                "encryptedPrivateKey", keys.getEncryptedPrivateKey() != null ? keys.getEncryptedPrivateKey() : ""));
    }

    @DeleteMapping("/sync-keys")
    public ResponseEntity<?> resetKeys(Authentication auth) {
        Integer userId = extractUserId(auth);
        chatService.resetKeys(userId);
        return ResponseEntity.ok(Map.of("message", "Encryption keys reset successfully. Please generate new keys."));
    }

    @GetMapping("/history/{otherUserId}")
    public ResponseEntity<?> getHistory(
            @PathVariable Integer otherUserId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            Authentication auth) {
        Integer myId = extractUserId(auth);
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);
        return ResponseEntity.ok(chatService.getConversationPaginated(myId, otherUserId, pageable).getContent());
    }

    @GetMapping("/keys/{userId}")
    public ResponseEntity<String> getPublicKey(@PathVariable Integer userId) {
        var keys = chatService.getKeys(userId);
        if (keys == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(keys.getPublicKeyPem());
    }

    private String extractRole(Authentication auth) {
        if (auth == null || auth.getAuthorities().isEmpty()) {
            return "UNKNOWN";
        }
        return auth.getAuthorities().iterator().next().getAuthority();
    }

    private Integer extractUserId(Authentication auth) {
        if (auth == null || auth.getPrincipal() == null) {
            throw new RuntimeException("User not authenticated. Please log in.");
        }
        Object p = auth.getPrincipal();
        if (p instanceof TrainerPrincipal tp)
            return tp.userId();
        if (p instanceof MemberPrincipal mp)
            return mp.userId();
        if (p instanceof AdminPrincipal ap)
            return ap.userId();
        throw new RuntimeException("Unauthorized: Invalid principal type");
    }

    @Data
    public static class KeySyncRequest {
        private String publicKey;
        private String encryptedPrivateKey;
    }
}
