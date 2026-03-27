package com.gymmanagement.trainer.trainer_panel.service;

import com.gymmanagement.commonservices.entity.AttendanceLog;
import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.commonservices.entity.Trainer;
import com.gymmanagement.trainer.trainer_panel.dto.AdminGymAttendanceDTO;
import com.gymmanagement.trainer.trainer_panel.dto.AttendanceMarkResponse;
import com.gymmanagement.trainer.trainer_panel.dto.AttendanceResponseDTO;
import com.gymmanagement.trainer.trainer_panel.repository.AttendanceRepository;
import com.gymmanagement.trainer.trainer_panel.repository.MemberRepository;
import com.gymmanagement.trainer.trainer_panel.repository.TrainerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final TrainerRepository trainerRepository;
    private final MemberRepository memberRepository;

    // MARK TODAY (Toggle PRESENT/ABSENT)
    public AttendanceMarkResponse markToday(Integer userId, String role, String status) {

        LocalDate today = LocalDate.now();

        // Check if already marked
        var existing = attendanceRepository.findByUserIdAndDate(userId, today);

        if (existing.isPresent()) {
            AttendanceLog log = existing.get();
            // If user sends same status -> ignore or error? USER REQUEST says:
            // "if user don't press of any particular day then mark that absent
            // automatically" -> Scheduling needed?
            // "this must include absent option also"

            // Logic: Update status if exists
            log.setStatus(status);
            attendanceRepository.save(log);
            return new AttendanceMarkResponse(log.getId(), true, "Attendance updated to " + status);
        }

        AttendanceLog log = new AttendanceLog();
        log.setUserId(userId);
        log.setRole(role);
        log.setDate(today);
        log.setStatus(status != null ? status : "PRESENT"); // Default PRESENT

        AttendanceLog saved = attendanceRepository.save(log);

        return new AttendanceMarkResponse(saved.getId(), true, "Attendance marked as " + log.getStatus());
    }

    // CHECK TODAY
    public boolean getToday(Integer userId) {
        return attendanceRepository.findByUserIdAndDate(userId, LocalDate.now()).isPresent();
    }

    // USER HISTORY
    public List<AttendanceResponseDTO> getHistory(Integer userId) {
        return attendanceRepository.findByUserIdOrderByDateDesc(userId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    // STREAK
    public int getStreak(Integer userId) {
        // Fetch logs sorted by date desc
        List<AttendanceLog> logs = attendanceRepository.findByUserIdOrderByDateDesc(userId);

        if (logs.isEmpty())
            return 0;

        // Filter only 'PRESENT' days and get unique dates
        List<LocalDate> dates = logs.stream()
                .filter(log -> "PRESENT".equalsIgnoreCase(log.getStatus()))
                .map(AttendanceLog::getDate)
                .distinct()
                .sorted((a, b) -> b.compareTo(a)) // Latest first
                .toList();

        if (dates.isEmpty())
            return 0;

        int streak = 0;
        LocalDate check = LocalDate.now();

        // 1. Check if today is present
        boolean todayPresent = dates.contains(check);

        // 2. If not today, verify if the streak ended yesterday
        if (!todayPresent) {
            check = check.minusDays(1);
            if (!dates.contains(check)) {
                return 0; // Streak broken or not started recently
            }
        }

        // 3. Count consecutive days backwards
        for (LocalDate d : dates) {
            // We expect the dates list to be contiguous for a streak.
            // Since we iterate through the SORTED list of PRESENT dates:
            if (d.isEqual(check)) {
                streak++;
                check = check.minusDays(1);
            } else {
                // Gap found
                // Example: We are looking for 6th, but next in list is 4th. Streak breaks.
                // Or: We found today (7th), next expected is 6th, but list has 5th.
                // However, the list only contains PRESENT dates.
                // If 'd' is BEFORE 'check', it means 'check' date is missing from the list.
                if (d.isBefore(check)) {
                    break;
                }
                // If 'd' is AFTER 'check', it shouldn't happen because list is sorted desc and
                // we start from today/yesterday.
            }
        }
        return streak;
    }

    // MAX STREAK
    public int getMaxStreak(Integer userId) {
        // Fetch logs sorted by date asc (oldest first) to iterate easily
        List<AttendanceLog> logs = attendanceRepository.findByUserIdOrderByDateDesc(userId);
        if (logs.isEmpty())
            return 0;

        // Filter only 'PRESENT' days and sort ASCENDING for calculation
        List<LocalDate> dates = logs.stream()
                .filter(log -> "PRESENT".equalsIgnoreCase(log.getStatus()))
                .map(AttendanceLog::getDate)
                .distinct()
                .sorted()
                .toList();

        if (dates.isEmpty())
            return 0;

        int maxStreak = 0;
        int currentStreak = 0;
        LocalDate lastDate = null;

        for (LocalDate d : dates) {
            if (lastDate == null) {
                currentStreak = 1;
            } else {
                if (d.minusDays(1).isEqual(lastDate)) {
                    currentStreak++;
                } else {
                    currentStreak = 1;
                }
            }
            if (currentStreak > maxStreak) {
                maxStreak = currentStreak;
            }
            lastDate = d;
        }

        return maxStreak;
    }

    // GYM ATTENDANCE
    public AdminGymAttendanceDTO getGymAttendance(Long gymId) {

        // fetch gym trainers
        List<Trainer> trainers = trainerRepository.findByGym_GymId(gymId);

        // fetch gym members
        List<Member> members = memberRepository.findByGym_GymId(gymId);

        // collect userIds
        List<Integer> userIds = new ArrayList<>();
        trainers.forEach(t -> userIds.add(t.getUser().getUserId()));
        members.forEach(m -> userIds.add(m.getUser().getUserId()));

        // load attendance
        List<AttendanceResponseDTO> records = attendanceRepository.findByUserIdInOrderByDateDesc(userIds)
                .stream()
                .map(this::toDTO)
                .toList();

        // prepare DTO
        AdminGymAttendanceDTO dto = new AdminGymAttendanceDTO();
        dto.setGymId(gymId.intValue());
        dto.setRecords(records);

        return dto;
    }

    private final com.gymmanagement.trainer.trainer_panel.client.UserManagementClient userClient;

    private AttendanceResponseDTO toDTO(AttendanceLog log) {
        AttendanceResponseDTO dto = new AttendanceResponseDTO();
        dto.setId(log.getId());
        dto.setUserId(log.getUserId());
        dto.setRole(log.getRole());
        dto.setDate(log.getDate());
        dto.setStatus(log.getStatus());

        try {
            var profile = userClient.getUserProfile(log.getUserId());
            if (profile != null) {
                String name = (profile.getFirstName() != null ? profile.getFirstName() : "") + " " +
                        (profile.getLastName() != null ? profile.getLastName() : "");
                dto.setFullName(name.trim());
            } else {
                dto.setFullName("Unknown");
            }
        } catch (Exception e) {
            dto.setFullName("Unknown");
        }

        return dto;
    }
}
