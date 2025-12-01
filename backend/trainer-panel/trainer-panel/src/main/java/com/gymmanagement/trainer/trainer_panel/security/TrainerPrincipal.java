// src/main/java/com/gymmanagement/trainer/trainer_panel/security/TrainerPrincipal.java
package com.gymmanagement.trainer.trainer_panel.security;

public record TrainerPrincipal(
        Integer userId,
        Integer trainerId,
        String email,
        String role
) {}
