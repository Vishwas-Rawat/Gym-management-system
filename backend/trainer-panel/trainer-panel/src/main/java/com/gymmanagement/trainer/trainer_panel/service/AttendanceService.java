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

    // MARK TODAY
    public AttendanceMarkResponse markToday(Integer userId, String role) {

        LocalDate today = LocalDate.now();

        attendanceRepository.findByUserIdAndDate(userId, today)
                .ifPresent(a -> {
                    throw new RuntimeException("Attendance already marked for today");
                });

        AttendanceLog log = new AttendanceLog();
        log.setUserId(userId);
        log.setRole(role);
        log.setDate(today);
        log.setStatus("PRESENT");

        AttendanceLog saved = attendanceRepository.save(log);

        return new AttendanceMarkResponse(saved.getId(), true, "Attendance marked successfully");
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
        List<AttendanceResponseDTO> records =
                attendanceRepository.findByUserIdInOrderByDateDesc(userIds)
                        .stream()
                        .map(this::toDTO)
                        .toList();

        // prepare DTO
        AdminGymAttendanceDTO dto = new AdminGymAttendanceDTO();
        dto.setGymId(gymId.intValue());
        dto.setRecords(records);

        return dto;
    }

    private AttendanceResponseDTO toDTO(AttendanceLog log) {
        AttendanceResponseDTO dto = new AttendanceResponseDTO();
        dto.setId(log.getId());
        dto.setUserId(log.getUserId());
        dto.setRole(log.getRole());
        dto.setDate(log.getDate());
        dto.setStatus(log.getStatus());
        return dto;
    }
}
