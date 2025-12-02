package com.gymmanagement.trainer.trainer_panel.security;


public record TrainerPrincipal(
        Integer userId,
        Integer trainerId,
        String email,
        String role
) implements java.security.Principal {

    @Override
    public String getName() {
        return userId != null ? userId.toString() : email;
    }
}
