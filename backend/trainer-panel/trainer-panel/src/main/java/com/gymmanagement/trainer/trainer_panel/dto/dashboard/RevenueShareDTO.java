package com.gymmanagement.trainer.trainer_panel.dto.dashboard;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RevenueShareDTO {
    private Double thisMonth;
    private Double yourSharePercent;
    private Double yourEarnings;
    private boolean paid;
}
