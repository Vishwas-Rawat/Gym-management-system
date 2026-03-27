package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Data;

@Data
public class ChatPayload {
    private Integer receiverUserId; // encrypt and send to recipient
    private String ciphertext;      // required - payload already encrypted by sender for receiver
    private String nonce;           // optional, if using libs that need nonce
    private String signature;       // optional: signature of ciphertext by sender (recommended)
}
