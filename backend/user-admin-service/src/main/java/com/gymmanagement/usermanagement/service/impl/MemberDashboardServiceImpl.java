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

    	Member member = memberRepo.findByUser(user)
    	        .orElseThrow(() -> new RuntimeException("Member not found"));


        MemberDashboardResponse res = new MemberDashboardResponse();

        // BASIC PROFILE
        res.setMemberId(member.getMemberId());
        res.setUserId(userId);
        res.setFullName(member.getUser().getUsername());
        res.setEmail(member.getUser().getEmail());

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
        res.setAttendanceCount(attendanceRepo.countAttendance(userId));

        // STREAK CALCULATION
        res.setAttendanceStreak(calculateStreak(attendanceRepo.findAllAttendanceDates(userId)));

        // PLANS (from other microservices later)
        res.setWorkoutPlan(null);
        res.setDietPlan(null);

        return res;
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
