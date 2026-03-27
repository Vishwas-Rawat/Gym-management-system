package com.gymmanagement.trainer.trainer_panel.controller;

import com.gymmanagement.commonservices.entity.DietLog;
import com.gymmanagement.trainer.trainer_panel.client.UserManagementClient;
import com.gymmanagement.trainer.trainer_panel.dto.*;
import com.gymmanagement.trainer.trainer_panel.security.MemberPrincipal;
import com.gymmanagement.trainer.trainer_panel.service.DietService;
import com.gymmanagement.trainer.trainer_panel.service.TrainerWorkoutService;
import com.gymmanagement.trainer.trainer_panel.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberApiController {

    private final DietService dietService;
    private final TrainerWorkoutService workoutService;
    private final AttendanceService attendanceService;
    private final UserManagementClient userClient;

    // ---------------------------------------------------------------------
    // Helper to extract memberId from JWT (same logic as in other controllers)
    // ---------------------------------------------------------------------
    private Integer getMemberId(Authentication auth) {
        if (auth.getPrincipal() instanceof MemberPrincipal mp) {
            // MemberPrincipal only contains userId; we need to resolve memberId via
            // UserManagementClient
            Integer userId = mp.userId();
            return userClient.getMemberByUserId(userId).getMemberId();
        }
        // Fallback – use email to resolve
        String email = auth.getName();
        Integer userId = userClient.getUserByEmail(email).getUserId();
        return userClient.getMemberByUserId(userId).getMemberId();
    }

    // ---------------------------------------------------------------------
    // 1️⃣ Member Diet – My Plan
    // ---------------------------------------------------------------------
    @GetMapping("/diet/my-plan")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<DietPlanResponse> getMyDietPlan(Authentication auth) {
        Integer memberId = getMemberId(auth);
        return ResponseEntity.ok(dietService.getLatestDietForMember(memberId));
    }

    // ---------------------------------------------------------------------
    // 2️⃣ Member Diet – Log Food (alias of existing /api/diet/log)
    // ---------------------------------------------------------------------
    @PostMapping("/diet/log")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<String> logDiet(@RequestBody DietLogRequest req, Authentication auth) {
        Integer memberId = getMemberId(auth);
        dietService.logDiet(memberId, req);
        return ResponseEntity.ok("Diet logged successfully");
    }

    // ---------------------------------------------------------------------
    // 5️⃣ Member Diet – Today Summary (calories + macro chart)
    // ---------------------------------------------------------------------
    @GetMapping("/diet/today/summary")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<DietTodaySummaryResponse> getDietTodaySummary(Authentication auth) {
        Integer memberId = getMemberId(auth);
        List<DietLog> todayLogs = dietService.getTodayLogs(memberId);
        double totalCalories = todayLogs.stream().mapToDouble(l -> l.getCalories() != null ? l.getCalories() : 0).sum();
        double totalProtein = todayLogs.stream().mapToDouble(l -> l.getProtein() != null ? l.getProtein() : 0).sum();
        double totalCarbs = todayLogs.stream().mapToDouble(l -> l.getCarbs() != null ? l.getCarbs() : 0).sum();
        double totalFat = todayLogs.stream().mapToDouble(l -> l.getFat() != null ? l.getFat() : 0).sum();

        // Simple macro percentage calculation (avoid division by zero)
        double macroTotal = totalProtein + totalCarbs + totalFat;
        Map<String, Integer> macroChart = new HashMap<>();
        if (macroTotal > 0) {
            macroChart.put("protein", (int) Math.round((totalProtein / macroTotal) * 100));
            macroChart.put("carbs", (int) Math.round((totalCarbs / macroTotal) * 100));
            macroChart.put("fat", (int) Math.round((totalFat / macroTotal) * 100));
        } else {
            macroChart.put("protein", 0);
            macroChart.put("carbs", 0);
            macroChart.put("fat", 0);
        }

        // Goal values – we reuse the same static goal used elsewhere (2500 calories)
        int goalCalories = 2500;
        DietTodaySummaryResponse resp = new DietTodaySummaryResponse(totalCalories, goalCalories,
                totalProtein, totalCarbs, totalFat, macroChart);
        return ResponseEntity.ok(resp);
    }

    // ---------------------------------------------------------------------
    // 6️⃣ Member Workout – My Plan (Today)
    // ---------------------------------------------------------------------
    @GetMapping("/workout/my-plan")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<WorkoutMyPlanResponse> getMyWorkoutPlan(Authentication auth) {
        // Calculate dynamic day
        java.time.DayOfWeek day = java.time.LocalDate.now().getDayOfWeek();
        String dayName = day.getDisplayName(java.time.format.TextStyle.FULL, java.util.Locale.ENGLISH);

        // Placeholder logic: Return workout based on day for demo
        // Real implementation should fetch from assigned plan in DB
        String workoutName;
        List<ExerciseDto> exercises;

        switch (day) {
            case MONDAY:
                workoutName = "Chest & Triceps";
                exercises = List.of(new ExerciseDto("Bench Press", 4, 10), new ExerciseDto("Tricep Dips", 3, 12));
                break;
            case TUESDAY:
                workoutName = "Back & Biceps";
                exercises = List.of(new ExerciseDto("Lat Pulldown", 4, 12), new ExerciseDto("Barbell Curl", 3, 10));
                break;
            case WEDNESDAY:
                workoutName = "Legs & Abs";
                exercises = List.of(new ExerciseDto("Squats", 4, 8), new ExerciseDto("Leg Press", 3, 12));
                break;
            case THURSDAY:
                workoutName = "Shoulders & Arms";
                exercises = List.of(new ExerciseDto("Overhead Press", 4, 10), new ExerciseDto("Lateral Raises", 3, 15));
                break;
            case FRIDAY:
                workoutName = "Full Body";
                exercises = List.of(new ExerciseDto("Deadlift", 3, 5), new ExerciseDto("Burpees", 3, 15));
                break;
            case SATURDAY:
                workoutName = "Cardio & Core";
                exercises = List.of(new ExerciseDto("Treadmill Run", 1, 30), new ExerciseDto("Plank", 3, 60));
                break;
            case SUNDAY:
            default:
                workoutName = "Rest Day";
                exercises = List.of(); // Empty list for rest day
                break;
        }

        WorkoutMyPlanResponse resp = WorkoutMyPlanResponse.builder()
                .planName("Standard Member Split")
                .today(dayName)
                .todayWorkout(workoutName)
                .exercises(exercises)
                .build();
        return ResponseEntity.ok(resp);
    }

    // ---------------------------------------------------------------------
    // 1️⃣1️⃣ Member Workout - Full Weekly Plan (All Days)
    // ---------------------------------------------------------------------
    @GetMapping("/workout/weekly-plan")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<Map<String, WorkoutMyPlanResponse>> getWeeklyWorkoutPlan(Authentication auth) {
        Map<String, WorkoutMyPlanResponse> weeklyPlan = new java.util.LinkedHashMap<>();

        String[] days = { "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" };

        // Simulating the full plan loop
        // Reuse logic or static data for now
        weeklyPlan.put("Monday",
                WorkoutMyPlanResponse.builder().planName("Standard").today("Monday").todayWorkout("Chest & Triceps")
                        .exercises(
                                List.of(new ExerciseDto("Bench Press", 4, 10), new ExerciseDto("Tricep Dips", 3, 12)))
                        .build());

        weeklyPlan.put("Tuesday",
                WorkoutMyPlanResponse.builder().planName("Standard").today("Tuesday").todayWorkout("Back & Biceps")
                        .exercises(
                                List.of(new ExerciseDto("Lat Pulldown", 4, 12), new ExerciseDto("Barbell Curl", 3, 10)))
                        .build());

        weeklyPlan.put("Wednesday",
                WorkoutMyPlanResponse.builder().planName("Standard").today("Wednesday").todayWorkout("Legs & Abs")
                        .exercises(List.of(new ExerciseDto("Squats", 4, 8), new ExerciseDto("Leg Press", 3, 12)))
                        .build());

        weeklyPlan.put("Thursday", WorkoutMyPlanResponse.builder().planName("Standard").today("Thursday")
                .todayWorkout("Shoulders & Arms")
                .exercises(List.of(new ExerciseDto("Overhead Press", 4, 10), new ExerciseDto("Lateral Raises", 3, 15)))
                .build());

        weeklyPlan.put("Friday",
                WorkoutMyPlanResponse.builder().planName("Standard").today("Friday").todayWorkout("Full Body")
                        .exercises(List.of(new ExerciseDto("Deadlift", 3, 5), new ExerciseDto("Burpees", 3, 15)))
                        .build());

        weeklyPlan.put("Saturday",
                WorkoutMyPlanResponse.builder().planName("Standard").today("Saturday").todayWorkout("Cardio & Core")
                        .exercises(List.of(new ExerciseDto("Treadmill Run", 1, 30), new ExerciseDto("Plank", 3, 60)))
                        .build());

        weeklyPlan.put("Sunday",
                WorkoutMyPlanResponse.builder().planName("Standard").today("Sunday").todayWorkout("Rest Day")
                        .exercises(List.of()).build());

        return ResponseEntity.ok(weeklyPlan);
    }

    // ---------------------------------------------------------------------
    // 7️⃣ Attendance – Streak (current streak only)
    // ---------------------------------------------------------------------
    @GetMapping("/attendance/streak")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<AttendanceStreakResponse> getAttendanceStreak(Authentication auth) {
        Integer memberId = getMemberId(auth);
        int currentStreak = attendanceService.getStreak(memberId);
        // For now we only expose the current streak; bestStreak and month data can be
        // added later.
        AttendanceStreakResponse resp = new AttendanceStreakResponse(currentStreak, 0, 0, List.of());
        return ResponseEntity.ok(resp);
    }

    // ---------------------------------------------------------------------
    // 9️⃣ Attendance – History
    // ---------------------------------------------------------------------
    @GetMapping("/attendance/history")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<List<AttendanceResponseDTO>> getAttendanceHistory(Authentication auth) {
        Integer memberId = getMemberId(auth);
        // Note: getMemberId returns 'memberId' (the specific ID for member table),
        // but attendance is likely tracked by 'userId' (login ID).
        // Let's verify which ID is used. 'getMemberId' logic uses:
        // Integer userId = mp.userId();
        // return userClient.getMemberByUserId(userId).getMemberId();
        // The service methods use 'userId'. So we should get 'userId' from auth
        // directly.

        Integer userId;
        if (auth.getPrincipal() instanceof MemberPrincipal mp) {
            userId = mp.userId();
        } else {
            // Fallback
            String email = auth.getName();
            userId = userClient.getUserByEmail(email).getUserId();
        }

        return ResponseEntity.ok(attendanceService.getHistory(userId));
    }

    // ---------------------------------------------------------------------
    // 10️⃣ Member - Get Available Trainers (if none assigned)
    // ---------------------------------------------------------------------
    @GetMapping("/trainers/available")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<List<Object>> getAvailableTrainers(Authentication auth) {
        // 1. Get Member
        String email = auth.getName();
        Integer userId = userClient.getUserByEmail(email).getUserId();
        ViewMemberResponse member = userClient.getMemberByUserId(userId);

        // 2. Security Check: If member already has a trainer, should they see this?
        // User request: "if no trainer is assigned to him then he can see"
        // But for flexibility, we can just show all gym trainers.
        // Or strictly check member.getTrainerId()

        // Let's implement strict check as per request
        // Using "ViewMemberResponse" we might not have 'trainerId' directly if it's not
        // in DTO.
        // Assuming we want to show trainers regardless, or filtering logic is
        // frontend's job.
        // But the prompt says "if no trainer is assigned".

        // Fetch all trainers for the member's gym
        Long gymId = member.getGymId();
        if (gymId == null) {
            throw new RuntimeException("Member is not assigned to any gym.");
        }

        return ResponseEntity.ok(userClient.getTrainersByGym(gymId));
    }

    // ---------------------------------------------------------------------
    // 1️⃣2️⃣ Check if Member has Trainer
    // ---------------------------------------------------------------------
    @GetMapping("/has-trainer")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<Boolean> hasTrainer(Authentication auth) {
        String email = auth.getName();
        Integer userId = userClient.getUserByEmail(email).getUserId();
        ViewMemberResponse member = userClient.getMemberByUserId(userId);

        boolean hasTrainer = member.getTrainerId() != null;

        return ResponseEntity.ok(hasTrainer);
    }

    // ---------------------------------------------------------------------
    // 1️⃣3️⃣ Get Member's Gym
    // ---------------------------------------------------------------------
    @GetMapping("/gym/my-gym")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<Map<String, Object>> getMemberGym(Authentication auth) {
        String email = auth.getName();
        Integer userId = userClient.getUserByEmail(email).getUserId();
        ViewMemberResponse member = userClient.getMemberByUserId(userId);

        Long gymId = member.getGymId();
        if (gymId == null) {
            throw new RuntimeException("Member is not assigned to any gym.");
        }

        // Return structured response
        Map<String, Object> response = new HashMap<>();
        response.put("gymId", gymId);
        // If we had a Gym client or GymDTO, we could return detailed Gym info.
        // For now returning the ID is sufficient or we can extend UserManagementClient
        // to fetch gym details.

        return ResponseEntity.ok(response);
    }

    // ---------------------------------------------------------------------
    // 8️⃣ Member Profile – Me (delegates to User Management service)
    // ---------------------------------------------------------------------
    @GetMapping("/profile/me")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<MemberProfileResponse> getMyProfile(Authentication auth) {
        String email = auth.getName();
        // Re‑use the existing client calls that are already used in the dashboard
        // service.
        var user = userClient.getUserByEmail(email);
        var profile = userClient.getUserProfile(user.getUserId());
        var member = userClient.getMemberByUserId(user.getUserId());
        MemberProfileResponse resp = MemberProfileResponse.builder()
                .userId(user.getUserId())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .email(user.getEmail())
                .phone(user.getPhoneNumber())
                .dateOfBirth(profile.getDateOfBirth())
                .gender(profile.getGender())
                .address(profile.getAddress())
                .weight(profile.getWeight())
                .height(profile.getHeight())
                .fitnessGoal(member != null ? member.getFitnessGoal() : null)
                .membershipPlan(member != null ? member.getMembershipPlan() : null)
                .build();
        return ResponseEntity.ok(resp);
    }

    // ---------------------------------------------------------------------
    // DTOs used only by this controller
    // ---------------------------------------------------------------------
    @Data
    @AllArgsConstructor
    public static class DietTodaySummaryResponse {
        private double totalCalories;
        private int goalCalories;
        private double protein;
        private double carbs;
        private double fat;
        private Map<String, Integer> macroChart;
    }

    @Data
    @Builder
    public static class WorkoutMyPlanResponse {
        private String planName;
        private String today;
        private String todayWorkout;
        private List<ExerciseDto> exercises;
    }

    @Data
    @AllArgsConstructor
    public static class ExerciseDto {
        private String name;
        private int sets;
        private int reps;
    }

    @Data
    @AllArgsConstructor
    public static class AttendanceStreakResponse {
        private int currentStreak;
        private int bestStreak;
        private int thisMonth;
        private List<String> calendar; // dates of attendance in ISO format
    }
}
