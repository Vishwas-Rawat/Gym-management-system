package com.gymmanagement.trainer.trainer_panel.service;

import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.trainer.trainer_panel.dto.*;
import com.gymmanagement.trainer.trainer_panel.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class MemberDashboardService {

    private final MemberRepository memberRepo;
    private final WorkoutRequestRepository workoutRequestRepo;
    private final DietRequestRepository dietRequestRepo;
    private final MemberWorkoutLogRepository workoutLogRepo;
    private final MemberDietLogRepository dietLogRepo;
    private final TrainerWorkoutService workoutService;
    private final DietService dietService;

    public MemberDashboardSummaryDTO getMemberSummary(Integer userId) {
        Member member = memberRepo.findByUser_UserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found for userId: " + userId));

        MemberDashboardSummaryDTO dto = new MemberDashboardSummaryDTO();
        dto.setHasTrainer(member.getTrainer() != null);
        dto.setTrainerName(member.getTrainer() != null ? member.getTrainer().getFullName() : null);

        Integer memberId = member.getMemberId();
        LocalDate today = LocalDate.now();

        // Pending Requests
        dto.setPendingWorkoutRequests(workoutRequestRepo.findByMemberIdOrderByCreatedAtDesc(memberId)
                .stream().filter(r -> "PENDING".equals(r.getStatus().toString())).count());
        dto.setPendingDietRequests(dietRequestRepo.findByMemberIdOrderByCreatedAtDesc(memberId)
                .stream().filter(r -> "PENDING".equals(r.getStatus().toString())).count());

        // Today's Logs
        dto.setTodayWorkoutLogsCount(workoutLogRepo.findByMemberIdAndDate(memberId, today).size());
        dto.setTodayDietLogsCount(dietLogRepo.findByMemberIdAndDate(memberId, today).size());

        // Latest Plans
        try {
            dto.setLatestWorkoutPlan(workoutService.getLatestPlanForMember(memberId));
        } catch (Exception e) {
            dto.setLatestWorkoutPlan(null);
        }

        try {
            dto.setLatestDietPlan(dietService.getLatestDietForMember(memberId));
        } catch (Exception e) {
            dto.setLatestDietPlan(null);
        }

        return dto;
    }
}
