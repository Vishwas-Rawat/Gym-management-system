package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContactResponse {
    private Integer userId;
    private String name;
    private String role; // MEMBER, TRAINER, ADMIN
    private String publicKey;
    private boolean online;
}
