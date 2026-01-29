package com.gymmanagement.usermanagement.service.impl;

import com.gymmanagement.commonservices.entity.*;
import com.gymmanagement.usermanagement.Response.*;
import com.gymmanagement.usermanagement.repository.*;
import com.gymmanagement.usermanagement.service.DashboardService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final MemberRepository memberRepo;
    private final TrainerRepository trainerRepo;
    private final AttendanceRepository attendanceRepo;
    private final UserRepository userRepo;
    private final GymRepository gymRepo;

    @Override
    public DashboardResponse getDashboard(Long gymId) {

        DashboardResponse res = new DashboardResponse();

        // --- BASIC COUNTS ---
        long totalMembers = memberRepo.countByGym_GymId(gymId);
        long activeMembers = memberRepo.countActiveMembers(gymId);
        List<Trainer> trainers = trainerRepo.findActiveTrainers(gymId);

        res.setTotalMembers(totalMembers);
        res.setActiveMembers(activeMembers);
        res.setTotalTrainers(trainers.size());

        // --- ATTENDANCE TODAY ---
        LocalDate today = LocalDate.now();
        res.setTrainersPresentToday(attendanceRepo.countByRoleAndDate("TRAINER", today));
        res.setMembersPresentToday(attendanceRepo.countByRoleAndDate("MEMBER", today));

        // --- EXPIRING MEMBERS ---
        List<Member> members = memberRepo.findAllByGym(gymId);
        List<ExpiringMemberDTO> expiringList = members.stream()
                .filter(m -> m.getPlanStartDate() != null)
                .map(m -> {
                    ExpiringMemberDTO dto = new ExpiringMemberDTO();
                    dto.setMemberId(m.getMemberId());
                    dto.setUserId(m.getUser().getUserId());
                    dto.setFullName(m.getUser().getUsername());
                    dto.setExpiryDate(m.getPlanStartDate().plusMonths(m.getMonthsPaid()));
                    return dto;
                })
                .filter(e -> e.getExpiryDate().isBefore(today.plusDays(7)))
                .toList();

        res.setExpiringMembers(expiringList);
        res.setExpiringMembershipCount(expiringList.size());

        // --- TRAINER ACTIVITY ---
        List<TrainerActivityDTO> trainerActivity = trainers.stream().map(t -> {
            TrainerActivityDTO dto = new TrainerActivityDTO();
            dto.setTrainerId(t.getTrainerId());
            dto.setFullName(t.getFullName());
            dto.setMemberCount(
                    members.stream()
                            .filter(m -> m.getTrainer() != null &&
                                    m.getTrainer().getTrainerId().equals(t.getTrainerId()))
                            .count());
            return dto;
        }).toList();

        res.setTrainerActivity(trainerActivity);

        // --- FINANCE (simple placeholders) ---
        double totalRevenue = members.stream().mapToDouble(Member::getTotalAmount).sum();
        res.setTotalRevenue(totalRevenue);
        res.setMonthlyRevenue(totalRevenue / 12);

        // --- PENDING REQUESTS (if needed integrate workout/diet repos) ---
        res.setPendingDietRequests(0);
        res.setPendingWorkoutRequests(0);

        return res;
    }

    @Override
    public AdminProfileResponse getAdminProfile(Integer adminId) {
        User user = userRepo.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));

        AdminProfileResponse res = new AdminProfileResponse();
        res.setUserId(user.getUserId());
        res.setEmail(user.getEmail());
        res.setPhoneNo(user.getPhoneNumber());
        res.setRole(user.getRole().name());

        if (user.getUserProfile() != null) {
            UserProfile p = user.getUserProfile();
            res.setFullName(p.getFirstName() + (p.getLastName() != null ? " " + p.getLastName() : ""));
            res.setAddress(p.getAddress());
            res.setGender(p.getGender());
            res.setDateOfBirth(p.getDateOfBirth());
        }

        List<Gym> gyms = gymRepo.findByCreatedByAdmin_UserId(adminId);
        res.setGyms(gyms.stream()
                .filter(g -> Boolean.TRUE.equals(g.getIsActive()))
                .map(g -> {
                    AdminProfileResponse.GymDto dto = new AdminProfileResponse.GymDto();
                    dto.setGymId(g.getGymId());
                    dto.setGymName(g.getGymName());
                    dto.setAddress(g.getAddress());
                    dto.setCity(g.getCity());
                    dto.setIsActive(g.getIsActive());
                    return dto;
                }).toList());

        return res;
    }
}
