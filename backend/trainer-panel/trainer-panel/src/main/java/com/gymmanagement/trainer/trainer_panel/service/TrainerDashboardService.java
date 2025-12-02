package com.gymmanagement.trainer.trainer_panel.service;

import com.gymmanagement.trainer.trainer_panel.client.UserManagementClient;
import com.gymmanagement.trainer.trainer_panel.dto.*;
import com.gymmanagement.trainer.trainer_panel.repository.AttendanceRepository;
import com.gymmanagement.trainer.trainer_panel.repository.ChatMessageRepository;

import com.gymmanagement.commonservices.entity.ChatMessage;

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

    public TrainerDashboardResponse getDashboard(Integer trainerUserId) {

        Integer trainerId = userClient.getTrainerIdByUserId(trainerUserId);
        Long gymId = userClient.getUserById(trainerUserId).getGymId();

        TrainerDashboardResponse res = new TrainerDashboardResponse();
        res.setTrainerId(trainerId);
        res.setGymId(gymId);

        // -------------------------
        // ASSIGNED MEMBERS
        // -------------------------
        List<ViewMemberResponse> members =
                userClient.getMembersByTrainer(gymId, trainerId);

        res.setAssignedMembersCount(members.size());

        res.setAssignedMembers(
                members.stream().map(m -> {
                    MemberSummaryDTO dto = new MemberSummaryDTO();
                    dto.setMemberId(m.getMemberId());
                    dto.setUserId(m.getUserId());
                    dto.setFullName(m.getFullName());
                    dto.setEmail(m.getEmail());
                    return dto;
                }).toList()
        );

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
                }).toList()
        );

        // -------------------------
        // RECENT ACTIVITY (Placeholder)
        // -------------------------
        res.setRecentActivity(List.of());

        return res;
    }
}
