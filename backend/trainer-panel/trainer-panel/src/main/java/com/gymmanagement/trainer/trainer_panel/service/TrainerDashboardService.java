package com.gymmanagement.trainer.trainer_panel.service;

import com.gymmanagement.trainer.trainer_panel.client.UserManagementClient;
import com.gymmanagement.trainer.trainer_panel.dto.*;
import com.gymmanagement.trainer.trainer_panel.repository.*;

import com.gymmanagement.commonservices.entity.ChatMessage;
import com.gymmanagement.commonservices.entity.Member;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TrainerDashboardService {

    private final UserManagementClient userClient;
    private final AttendanceRepository attendanceRepo;
    private final ChatMessageRepository chatRepo;
    private final MemberRepository memberRepo;
    private final WorkoutRequestRepository workoutRequestRepo;
    private final DietRequestRepository dietRequestRepo;
    private final MemberWorkoutLogRepository workoutLogRepo;

    public TrainerDashboardResponse getDashboard(Integer trainerUserId) {

        Integer trainerId = userClient.getTrainerIdByUserId(trainerUserId);
        Long gymId = userClient.getUserById(trainerUserId).getGymId();

        TrainerDashboardResponse res = new TrainerDashboardResponse();
        res.setTrainerId(trainerId);
        res.setGymId(gymId);

        // -------------------------
        // ASSIGNED MEMBERS
        // -------------------------
        List<ViewMemberResponse> members = userClient.getMembersByTrainer(gymId, trainerId);

        res.setAssignedMembersCount(members.size());

        res.setAssignedMembers(
                members.stream().map(m -> {
                    MemberSummaryDTO dto = new MemberSummaryDTO();
                    dto.setMemberId(m.getMemberId());
                    dto.setUserId(m.getUserId());
                    dto.setFullName(m.getFullName());
                    dto.setEmail(m.getEmail());
                    return dto;
                }).toList());

        // -------------------------
        // PENDING REQUESTS
        // -------------------------
        res.setPendingDietRequests(0);
        res.setPendingWorkoutRequests(0);

        // -------------------------
        // ATTENDANCE TODAY
        // -------------------------
        long count = attendanceRepo.countMembersPresentToday(trainerId, LocalDate.now());
        res.setMembersPresentToday((int) count);

        // -------------------------
        // CHAT NOTIFICATIONS (UNREAD MESSAGES)
        // -------------------------
        List<ChatMessage> unread = chatRepo.findUnreadMessagesForTrainer(trainerUserId);

        res.setUnreadChatCount(unread.size());

        res.setUnreadChats(
                unread.stream().map(msg -> {
                    ChatNotificationDTO dto = new ChatNotificationDTO();
                    dto.setMessageId(msg.getMessageId());
                    dto.setFromUserId(msg.getSenderUserId());
                    dto.setCiphertext(msg.getCiphertext());
                    dto.setCreatedAt(msg.getCreatedAt());
                    return dto;
                }).toList());

        // -------------------------
        // RECENT ACTIVITY (Placeholder)
        // -------------------------
        res.setRecentActivity(List.of());

        return res;
    }

    public List<MemberSummaryDTO> getActiveMembers(Integer trainerId) {
        return memberRepo.findByTrainer_TrainerId(trainerId).stream()
                .filter(Member::getIsActive)
                .map(m -> {
                    MemberSummaryDTO dto = new MemberSummaryDTO();
                    dto.setMemberId(m.getMemberId());
                    dto.setUserId(m.getUser().getUserId());
                    dto.setFullName(m.getUser().getUsername());
                    dto.setEmail(m.getUser().getEmail());
                    return dto;
                }).toList();
    }

    public List<MemberConsistencyDTO> getConsistencyStats(Integer trainerId, boolean consistent) {
        LocalDate startDate = LocalDate.now().minusDays(30);
        List<MemberConsistencyDTO> stats = attendanceRepo.getConsistencyStats(trainerId, startDate);

        if (consistent) {
            return stats.stream().limit(5).toList();
        } else {
            // Reverse order for inconsistent
            java.util.Collections.reverse(stats);
            return stats.stream().limit(5).toList();
        }
    }

    public List<MemberRequestSummaryDTO> getRequestSummary(Integer trainerId) {
        List<Member> members = memberRepo.findByTrainer_TrainerId(trainerId);
        return members.stream().map(m -> {
            MemberRequestSummaryDTO dto = new MemberRequestSummaryDTO();
            dto.setMemberId(m.getMemberId());
            dto.setFullName(m.getUser().getUsername());
            dto.setPendingWorkoutRequests(workoutRequestRepo.findByMemberIdOrderByCreatedAtDesc(m.getMemberId())
                    .stream().filter(r -> "PENDING".equals(r.getStatus().toString())).count());
            dto.setPendingDietRequests(dietRequestRepo.findByMemberIdOrderByCreatedAtDesc(m.getMemberId())
                    .stream().filter(r -> "PENDING".equals(r.getStatus().toString())).count());
            return dto;
        }).filter(d -> d.getPendingDietRequests() > 0 || d.getPendingWorkoutRequests() > 0).toList();
    }

    public List<SubscriptionExpiryDTO> getSubscriptionExpiries(Integer trainerId) {
        List<Member> members = memberRepo.findByTrainer_TrainerId(trainerId);
        LocalDate today = LocalDate.now();
        return members.stream()
                .filter(m -> m.getPlanStartDate() != null && m.getMonthsPaid() != null)
                .map(m -> {
                    LocalDate expiryDate = m.getPlanStartDate().plusMonths(m.getMonthsPaid());
                    long daysLeft = java.time.temporal.ChronoUnit.DAYS.between(today, expiryDate);
                    return new SubscriptionExpiryDTO(m.getMemberId(), m.getUser().getUsername(), expiryDate, daysLeft);
                })
                .filter(s -> s.getDaysLeft() >= 0 && s.getDaysLeft() <= 7)
                .toList();
    }

    // Keep old chart methods as placeholders or remove them if not used by
    // controller
    // Removing them since the user said "remove all dashboard apis"
}
