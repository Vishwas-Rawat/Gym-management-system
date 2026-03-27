package com.gymmanagement.trainer.trainer_panel.config;

import com.gymmanagement.trainer.trainer_panel.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class ScheduledPurgeConfig {

    private final ChatService chatService;

    // runs daily at 02:00
    @Scheduled(cron = "0 0 2 * * *")
    public void purgeOldMessages() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(30);
        chatService.purgeOlderThan(cutoff);
    }
}
