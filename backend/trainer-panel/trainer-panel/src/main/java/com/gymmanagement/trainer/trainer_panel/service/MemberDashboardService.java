package com.gymmanagement.trainer.trainer_panel.service;

import com.gymmanagement.commonservices.entity.DietLog;
import com.gymmanagement.commonservices.entity.WorkoutLog;
import com.gymmanagement.trainer.trainer_panel.client.UserManagementClient;
import com.gymmanagement.trainer.trainer_panel.dto.MemberDashboardHomeDTO;
import com.gymmanagement.trainer.trainer_panel.dto.MemberDashboardTodayDTO;
import com.gymmanagement.trainer.trainer_panel.dto.UserProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberDashboardService {

    private final DietService dietService;
    private final TrainerWorkoutService workoutService;
    private final AttendanceService attendanceService;
    private final UserManagementClient userClient;

    public MemberDashboardHomeDTO getHomeStats(Integer memberId, Integer userId) {
        int streak = attendanceService.getStreak(userId);

        List<DietLog> dietLogs = dietService.getTodayLogs(memberId);
        double calories = dietLogs.stream().mapToDouble(d -> d.getCalories() != null ? d.getCalories() : 0).sum();

        List<WorkoutLog> workoutLogs = workoutService.getTodayWorkoutLogs(memberId);
        boolean workoutDone = !workoutLogs.isEmpty();

        UserProfileResponse profile = null;
        try {
            profile = userClient.getUserProfile(userId);
        } catch (Exception e) {
        }

        return MemberDashboardHomeDTO.builder()
                .streak(streak)
                .caloriesConsumed(calories)
                .caloriesTarget(2500.0) // Mock target
                .workoutCompleted(workoutDone)
                .nextWorkoutName("Full Body") // Mock
                .weight(profile != null && profile.getWeight() != null ? profile.getWeight() : 0.0)
                .quote("Pain is temporary. Pride is forever.")
                .build();
    }

    public MemberDashboardTodayDTO getTodayStats(Integer memberId, Integer userId) {
        List<DietLog> dietLogs = dietService.getTodayLogs(memberId);
        List<WorkoutLog> workoutLogs = workoutService.getTodayWorkoutLogs(memberId);
        boolean present = attendanceService.getToday(userId);

        double calories = dietLogs.stream().mapToDouble(d -> d.getCalories() != null ? d.getCalories() : 0).sum();
        double protein = dietLogs.stream().mapToDouble(d -> d.getProtein() != null ? d.getProtein() : 0).sum();
        double carbs = dietLogs.stream().mapToDouble(d -> d.getCarbs() != null ? d.getCarbs() : 0).sum();
        double fat = dietLogs.stream().mapToDouble(d -> d.getFat() != null ? d.getFat() : 0).sum();

        return MemberDashboardTodayDTO.builder()
                .dietLogs(dietLogs)
                .workoutLogs(workoutLogs)
                .attendanceMarked(present)
                .caloriesConsumed(calories)
                .proteinConsumed(protein)
                .carbsConsumed(carbs)
                .fatConsumed(fat)
                .build();
    }
}
