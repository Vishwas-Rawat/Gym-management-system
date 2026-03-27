package com.gymmanagement.trainer.trainer_panel.dto;

import lombok.Data;
import java.util.List;

@Data
public class TrainerDashboardResponse {

    private Integer trainerId;
    private Long gymId;

    private int assignedMembersCount;
    private int pendingDietRequests;
    private int pendingWorkoutRequests;
    private long membersPresentToday;

    private int unreadChatCount;
    private List<ChatNotificationDTO> unreadChats;

    private List<MemberSummaryDTO> assignedMembers;
    private List<ActivityLogDTO> recentActivity;
}
