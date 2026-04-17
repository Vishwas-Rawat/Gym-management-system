package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubscriptionExpiryDTO {
    private Integer memberId;
    private String fullName;
    private LocalDate expiryDate;
    private long daysLeft;
}
