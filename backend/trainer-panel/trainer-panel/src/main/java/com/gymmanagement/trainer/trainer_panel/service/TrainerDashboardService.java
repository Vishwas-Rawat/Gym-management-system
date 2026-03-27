package com.gymmanagement.trainer.trainer_panel.service;

import com.gymmanagement.commonservices.entity.AttendanceLog;
import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.commonservices.entity.Trainer;
import com.gymmanagement.trainer.trainer_panel.client.UserManagementClient;
import com.gymmanagement.trainer.trainer_panel.dto.UserProfileResponse;
import com.gymmanagement.trainer.trainer_panel.dto.dashboard.*;
import com.gymmanagement.trainer.trainer_panel.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class TrainerDashboardService {

    private final TrainerRepository trainerRepository;
    private final MemberRepository memberRepository;
    private final DietPlanRepository dietRepo;
    private final WorkoutPlanRepository workoutRepo;
    private final AttendanceRepository attendanceRepo;
    private final UserManagementClient userClient;

    public TrainerStatsDTO getStats(Integer trainerId) {
        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));

        // Use userClient for user details since trainer.getUser() might be lazy or
        // partial
        UserProfileResponse profile = userClient.getUserProfile(trainer.getUser().getUserId());

        List<Member> members = memberRepository.findByTrainer_TrainerId(trainerId);
        List<Integer> userIds = members.stream()
                .map(m -> m.getUser().getUserId())
                .collect(Collectors.toList());

        long activeToday = 0;
        if (!userIds.isEmpty()) {
            activeToday = attendanceRepo.countByUserIdInAndDate(userIds, LocalDate.now());
        }

        long dietPlans = dietRepo.countByTrainerId(trainerId);
        long workoutPlans = workoutRepo.countByTrainerId(trainerId);

        return TrainerStatsDTO.builder()
                .trainerId(trainerId)
                .name(profile.getFirstName() + " " + profile.getLastName())
                .gymName(trainer.getGym().getGymName())
                .totalMembers(members.size())
                .activeToday((int) activeToday)
                .dietPlansAssigned(dietPlans)
                .workoutPlansAssigned(workoutPlans)
                .pendingDietRequests(3) // Mocked
                .totalEarningsThisMonth((double) (members.size() * 500)) // Mock logic
                .rating(4.8) // Mocked
                .unreadMessages(7) // Mocked
                .build();
    }

    public List<MyMemberDTO> getMyMembers(Integer trainerId) {
        List<Member> members = memberRepository.findByTrainer_TrainerId(trainerId);

        return members.stream().map(m -> {
            Integer userId = m.getUser().getUserId();
            UserProfileResponse profile = null;
            try {
                profile = userClient.getUserProfile(userId);
            } catch (Exception e) {
                // Ignore failure
            }

            LocalDate lastAtt = attendanceRepo.findTopByUserIdOrderByDateDesc(userId)
                    .map(AttendanceLog::getDate)
                    .orElse(null);

            long daysSince = 0;
            if (lastAtt != null) {
                daysSince = ChronoUnit.DAYS.between(lastAtt, LocalDate.now());
            }

            boolean hasDiet = dietRepo.existsByMemberId(m.getMemberId());
            boolean hasWorkout = workoutRepo.existsByMemberId(m.getMemberId());

            return MyMemberDTO.builder()
                    .memberId(m.getMemberId())
                    .name(profile != null ? profile.getFirstName() + " " + profile.getLastName() : "Unknown")
                    .phone(m.getUser().getPhoneNumber())
                    .photo("https://via.placeholder.com/150")
                    .plan(m.getMembershipPlan() != null ? m.getMembershipPlan() : "Standard")
                    .lastAttendance(lastAtt)
                    .daysSinceLastVisit(daysSince)
                    .hasActiveDietPlan(hasDiet)
                    .hasActiveWorkoutPlan(hasWorkout)
                    .build();
        }).collect(Collectors.toList());
    }

    public List<TodayAttendanceDTO> getTodayAttendance(Integer trainerId) {
        List<Member> members = memberRepository.findByTrainer_TrainerId(trainerId);
        if (members.isEmpty())
            return Collections.emptyList();

        List<Integer> userIds = members.stream()
                .map(m -> m.getUser().getUserId())
                .collect(Collectors.toList());

        List<AttendanceLog> logs = attendanceRepo.findByUserIdInAndDate(userIds, LocalDate.now());

        return logs.stream().map(log -> {
            Integer userId = log.getUserId();
            // Find member ID from list
            Member member = members.stream()
                    .filter(m -> m.getUser().getUserId().equals(userId))
                    .findFirst()
                    .orElse(null);

            String name = "Unknown";
            try {
                UserProfileResponse p = userClient.getUserProfile(userId);
                if (p != null)
                    name = p.getFirstName() + " " + p.getLastName();
            } catch (Exception e) {
            }

            return TodayAttendanceDTO.builder()
                    .memberId(member != null ? member.getMemberId() : 0)
                    .name(name)
                    .checkInTime("09:00 AM") // AttendanceLog doesn't have time yet
                    .workoutLogged(true)
                    .dietLogged(false)
                    .build();
        }).collect(Collectors.toList());
    }

    public List<InactiveMemberDTO> getInactiveMembers(Integer trainerId) {
        List<Member> members = memberRepository.findByTrainer_TrainerId(trainerId);
        List<InactiveMemberDTO> inactive = new ArrayList<>();

        for (Member m : members) {
            Integer userId = m.getUser().getUserId();
            LocalDate lastAtt = attendanceRepo.findTopByUserIdOrderByDateDesc(userId)
                    .map(AttendanceLog::getDate)
                    .orElse(null);

            long daysAbsent = 999;
            if (lastAtt != null) {
                daysAbsent = ChronoUnit.DAYS.between(lastAtt, LocalDate.now());
            }

            if (daysAbsent > 7) {
                String name = "Unknown";
                try {
                    UserProfileResponse p = userClient.getUserProfile(userId);
                    if (p != null)
                        name = p.getFirstName() + " " + p.getLastName();
                } catch (Exception e) {
                }

                inactive.add(InactiveMemberDTO.builder()
                        .memberId(m.getMemberId())
                        .name(name)
                        .lastAttendance(lastAtt)
                        .daysAbsent(daysAbsent)
                        .phone("N/A")
                        .build());
            }
        }
        return inactive;
    }

    public List<UpcomingBirthdayDTO> getUpcomingBirthdays(Integer trainerId) {
        List<Member> members = memberRepository.findByTrainer_TrainerId(trainerId);
        List<UpcomingBirthdayDTO> bdays = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (Member m : members) {
            Integer userId = m.getUser().getUserId();
            try {
                UserProfileResponse p = userClient.getUserProfile(userId);
                if (p != null && p.getDateOfBirth() != null) {
                    LocalDate dob = p.getDateOfBirth();
                    // Calculate next birthday
                    LocalDate nextBday = dob.withYear(today.getYear());
                    if (nextBday.isBefore(today) || nextBday.isEqual(today)) {
                        nextBday = nextBday.plusYears(1);
                    }

                    long daysUntil = ChronoUnit.DAYS.between(today, nextBday);
                    if (daysUntil <= 30) {
                        bdays.add(UpcomingBirthdayDTO.builder()
                                .memberId(m.getMemberId())
                                .name(p.getFirstName() + " " + p.getLastName())
                                .birthday(nextBday) // returning next birthday date
                                .daysUntil(daysUntil)
                                .build());
                    }
                }
            } catch (Exception e) {
            }
        }
        return bdays;
    }

    public ComplianceDTO getDietCompliance(Integer trainerId) {
        // Mock implementation since we don't have daily diet logging yet
        List<Member> members = memberRepository.findByTrainer_TrainerId(trainerId);
        int total = members.size();
        int logged = (int) (total * 0.6); // 60% compliance

        return ComplianceDTO.builder()
                .todayLogged(logged)
                .totalMembers(total)
                .compliancePercent(60)
                .topPerformers(List.of("Amit", "Priya", "Rohan"))
                .build();
    }

    public ComplianceDTO getWorkoutCompliance(Integer trainerId) {
        List<Member> members = memberRepository.findByTrainer_TrainerId(trainerId);
        int total = members.size();
        int logged = (int) (total * 0.73);

        return ComplianceDTO.builder()
                .todayLogged(logged)
                .totalMembers(total)
                .compliancePercent(73)
                .message("Great job! 73% of your members trained today")
                .build();
    }

    public RevenueShareDTO getRevenueShare(Integer trainerId) {
        List<Member> members = memberRepository.findByTrainer_TrainerId(trainerId);
        double total = members.size() * 3000.0; // Assume 3000 per member
        double share = 40.0;

        return RevenueShareDTO.builder()
                .thisMonth(total)
                .yourSharePercent(share)
                .yourEarnings(total * (share / 100))
                .paid(false)
                .build();
    }
}
