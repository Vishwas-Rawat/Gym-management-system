package com.gymmanagement.trainer.trainer_panel.controller;

import com.gymmanagement.trainer.trainer_panel.dto.ChatPayload;
import com.gymmanagement.trainer.trainer_panel.dto.TypingPayload;
import com.gymmanagement.trainer.trainer_panel.dto.ReadReceiptPayload;
import com.gymmanagement.trainer.trainer_panel.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    // Client sends to /app/chat/send
    @MessageMapping("/chat/send")
    public void handleSend(@Payload ChatPayload payload,
                           @Header("simpUser") java.security.Principal principal) {

        System.out.println("🔥 handleSend CALLED — payload = " + payload);

        Integer senderUserId = Integer.valueOf(principal.getName());

        var saved = chatService.saveMessage(senderUserId,
                payload.getReceiverUserId(),
                payload.getCiphertext());

        System.out.println("🔥 MESSAGE SAVED? saved = " + saved);

        messagingTemplate.convertAndSendToUser(
                payload.getReceiverUserId().toString(),
                "/queue/messages",
                saved
        );

        messagingTemplate.convertAndSendToUser(
                principal.getName(),
                "/queue/messages",
                saved
        );
    }


    // Typing indicator: client sends to /app/chat/typing
    @MessageMapping("/chat/typing")
    public void handleTyping(@Payload TypingPayload payload, @Header("simpUser") java.security.Principal principal) {
        // forward to recipient topic
        messagingTemplate.convertAndSendToUser(
                payload.getToUserId().toString(),
                "/queue/typing",
                payload
        );
    }

    // Read receipt sent from reader client: /app/chat/read
    @MessageMapping("/chat/read")
    public void handleRead(@Payload ReadReceiptPayload payload, @Header("simpUser") java.security.Principal principal) {
        chatService.markMessageRead(payload.getMessageId());
        // optionally notify sender
        var msg = chatService.getById(payload.getMessageId()); // implement getById if needed
        if (msg != null) {
            messagingTemplate.convertAndSendToUser(
                    msg.getSenderUserId().toString(),
                    "/queue/read-receipts",
                    payload
            );
        }
    }
}
