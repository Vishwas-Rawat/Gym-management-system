package com.gymmanagement.trainer.trainer_panel.dto;

import com.gymmanagement.commonservices.entity.MemberDietLog;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class DietLogResponse {
    private LocalDate date;
    private List<MemberDietLog> logs;

    private Double totalCalories;
    private Double totalProtein;
    private Double totalCarbs;
    private Double totalFat;

    public DietLogResponse(LocalDate date, List<MemberDietLog> logs) {
        this.date = date;
        this.logs = logs;
        this.totalCalories = logs.stream().mapToDouble(MemberDietLog::getTotalCalories).sum();
        this.totalProtein = logs.stream().mapToDouble(MemberDietLog::getTotalProtein).sum();
        this.totalCarbs = logs.stream().mapToDouble(MemberDietLog::getTotalCarbs).sum();
        this.totalFat = logs.stream().mapToDouble(MemberDietLog::getTotalFat).sum();
    }
}
