package com.gymmanagement.usermanagement.service.impl;

import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.commonservices.entity.Trainer;
import com.gymmanagement.commonservices.entity.User;
import com.gymmanagement.usermanagement.Response.MemberDashboardResponse;
import com.gymmanagement.usermanagement.repository.*;
import com.gymmanagement.usermanagement.service.MemberDashboardService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberDashboardServiceImpl implements MemberDashboardService {

    private final MemberRepository memberRepo;
    private final AttendanceRepository attendanceRepo;
    private final UserRepository userRepo;

    @Override
    public MemberDashboardResponse getDashboard(Integer userId) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Member member = memberRepo.findByUser(user).stream()
                .filter(m -> Boolean.TRUE.equals(m.getIsActive()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Member not found"));

        MemberDashboardResponse res = new MemberDashboardResponse();

        // BASIC PROFILE
        res.setMemberId(member.getMemberId());
        res.setUserId(userId);
        res.setFullName(member.getUser().getUsername());
        res.setEmail(member.getUser().getEmail());
        res.setGymId(member.getGym().getGymId());

        // TRAINER DETAILS
        Trainer trainer = member.getTrainer();
        if (trainer != null) {
            res.setTrainerName(trainer.getFullName());
            res.setTrainerPhone(trainer.getPhoneNo());
            res.setTrainerSpecialization(trainer.getSpecialization());
            res.setTrainerUserId(trainer.getUser().getUserId());
        }

        // MEMBERSHIP EXPIRY
        if (member.getPlanStartDate() != null) {
            LocalDate expiry = member.getPlanStartDate().plusMonths(member.getMonthsPaid());
            res.setMembershipExpiryDate(expiry.toString());
        }

        // ATTENDANCE COUNT
        List<LocalDate> allDates = attendanceRepo.findAllAttendanceDates(userId);
        res.setAttendanceCount(allDates.size());
        res.setAttendanceHistory(allDates);

        // STREAK CALCULATION
        res.setAttendanceStreak(calculateStreak(allDates));
        res.setBestStreak(calculateBestStreak(allDates));

        // PLANS (from other microservices later)
        res.setWorkoutPlan(null);
        res.setDietPlan(null);

        return res;
    }

    private int calculateBestStreak(List<LocalDate> dates) {
        if (dates.isEmpty())
            return 0;
        int maxStreak = 0;
        int current = 0;
        LocalDate lastDate = null;

        for (int i = dates.size() - 1; i >= 0; i--) {
            LocalDate d = dates.get(i);
            if (lastDate == null || d.equals(lastDate.plusDays(1))) {
                current++;
            } else if (!d.equals(lastDate)) {
                current = 1;
            }
            maxStreak = Math.max(maxStreak, current);
            lastDate = d;
        }
        return maxStreak;
    }

    private int calculateStreak(List<LocalDate> dates) {
        int streak = 0;
        LocalDate today = LocalDate.now();

        for (LocalDate d : dates) {
            if (d.equals(today.minusDays(streak))) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }
}
