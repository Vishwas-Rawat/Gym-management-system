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

    private boolean isMemberValid(Member m) {
        return m != null &&
                Boolean.TRUE.equals(m.getIsActive()) &&
                m.getDeletedAt() == null &&
                m.getUser() != null &&
                Boolean.TRUE.equals(m.getUser().getIsActive()) &&
                m.getGym() != null &&
                Boolean.TRUE.equals(m.getGym().getIsActive());
    }

    private boolean isTrainerValid(Trainer t) {
        return t != null &&
                Boolean.TRUE.equals(t.getIsActive()) &&
                Boolean.FALSE.equals(t.getDeleted()) &&
                t.getDeletedAt() == null &&
                t.getUser() != null &&
                Boolean.TRUE.equals(t.getUser().getIsActive()) &&
                t.getGym() != null &&
                Boolean.TRUE.equals(t.getGym().getIsActive());
    }

    // TOGGLE ATTENDANCE (Mark/Unmark)
    public AttendanceMarkResponse markToday(Integer userId, String role) {

        LocalDate today = LocalDate.now();
        System.out.println("DEBUG: Checking existing attendance for userId: " + userId + ", date: " + today);
        var existing = attendanceRepository.findByUserIdAndDate(userId, today);
        System.out.println("DEBUG: Existing record present? " + existing.isPresent());

        if (existing.isPresent()) {
            Long deletedId = existing.get().getId(); // Capture ID before delete
            attendanceRepository.delete(existing.get());
            System.out.println("DEBUG: Deleted existing record: " + deletedId);
            // Toggle to ABSENT (Record removed)
            return new AttendanceMarkResponse(null, false, "ABSENT", "Attendance marked as Absent");
        }

        AttendanceLog log = new AttendanceLog();
        log.setUserId(userId);
        log.setRole(role);
        log.setDate(today);
        log.setStatus("PRESENT");
        System.out.println("DEBUG: Saving new attendance log: " + log);
        AttendanceLog saved = attendanceRepository.save(log);
        System.out.println("DEBUG: Saved. ID: " + saved.getId());

        return new AttendanceMarkResponse(saved.getId(), true, "PRESENT", "Attendance marked as Present");
    }

    // CHECK TODAY
    public boolean getToday(Integer userId) {
        return attendanceRepository.findByUserIdAndDate(userId, LocalDate.now()).isPresent();
    }

    // USER HISTORY
    public List<AttendanceResponseDTO> getHistory(Integer userId) {
        // 1. Get existing records
        List<AttendanceLog> logs = attendanceRepository.findByUserIdOrderByDateDesc(userId);

        // 2. Map for quick lookup
        java.util.Map<LocalDate, AttendanceLog> logMap = logs.stream()
                .collect(java.util.stream.Collectors.toMap(
                        AttendanceLog::getDate,
                        log -> log,
                        (existing, replacement) -> existing));

        // 3. Generate last 30 days list
        List<AttendanceResponseDTO> history = new ArrayList<>();
        LocalDate today = LocalDate.now();

        // 0 to 29 = 30 days total
        for (int i = 0; i < 30; i++) {
            LocalDate date = today.minusDays(i);

            if (logMap.containsKey(date)) {
                // Return 'PRESENT' record from DB
                history.add(toDTO(logMap.get(date)));
            } else {
                // Identify missing day -> 'NOT MARKED'
                AttendanceResponseDTO dto = new AttendanceResponseDTO();
                dto.setUserId(userId);
                // ID is null for virtual records
                // Role is unknown here but optional for display
                dto.setDate(date);
                dto.setStatus("NOT MARKED");
                history.add(dto);
            }
        }

        return history;
    }

    // GYM ATTENDANCE with Sorting, Names, and Absent Logic
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public AdminGymAttendanceDTO getGymAttendance(Long gymId, String sortBy, String direction, LocalDate date,
            Integer adminId) {

        // 1. Fetch ALL Gym Users (Handling Multi-Gym)
        List<Trainer> trainers = new ArrayList<>();
        List<Member> members = new ArrayList<>();

        if (gymId != null && gymId > 0) {
            trainers = trainerRepository.findByGym_GymId(gymId);
            members = memberRepository.findByGym_GymId(gymId);
        } else if (adminId != null) {
            trainers = trainerRepository.findByGym_CreatedByAdmin_UserId(adminId);
            members = memberRepository.findByGym_CreatedByAdmin_UserId(adminId);
        }

        // Filter out users from inactive gyms / inactive users
        trainers = trainers.stream()
                .filter(this::isTrainerValid)
                .toList();
        members = members.stream()
                .filter(this::isMemberValid)
                .toList();

        // 2. Map Names (UserId -> NamePair)
        java.util.Map<Integer, String[]> nameMap = new java.util.HashMap<>();
        java.util.Map<Integer, String> roleMap = new java.util.HashMap<>(); // To track role for absent users

        for (Trainer t : trainers) {
            String first = "Unknown";
            String last = "Trainer";

            if (t.getUser() != null) {
                try {
                    var profile = t.getUser().getUserProfile();
                    if (profile != null) {
                        first = profile.getFirstName();
                        last = profile.getLastName();
                    } else if (t.getFullName() != null) {
                        String[] parts = t.getFullName().split(" ", 2);
                        first = parts[0];
                        last = parts.length > 1 ? parts[1] : "";
                    }
                } catch (Exception e) {
                    if (t.getFullName() != null) {
                        String[] parts = t.getFullName().split(" ", 2);
                        first = parts[0];
                        last = parts.length > 1 ? parts[1] : "";
                    }
                }

                nameMap.put(t.getUser().getUserId(), new String[] { first, last });
                roleMap.put(t.getUser().getUserId(), "TRAINER");
            }
        }

        for (Member m : members) {
            if (m.getUser() != null) {
                roleMap.put(m.getUser().getUserId(), "MEMBER");
                try {
                    var profile = m.getUser().getUserProfile();
                    if (profile != null) {
                        nameMap.put(m.getUser().getUserId(),
                                new String[] { profile.getFirstName(), profile.getLastName() });
                    }
                } catch (Exception e) {
                    // ignore
                }
            }
        }

        List<Integer> allUserIds = new ArrayList<>(nameMap.keySet());
        List<AttendanceResponseDTO> records = new ArrayList<>();

        // 3. LOGIC BRANCH
        if (date != null) {
            // === DAILY VIEW (Includes ABSENT) ===

            List<AttendanceLog> dayLogs = attendanceRepository.findByUserIdInOrderByDateDesc(allUserIds)
                    .stream()
                    .filter(log -> log.getDate().equals(date))
                    .toList();

            java.util.Map<Integer, AttendanceLog> logMap = dayLogs.stream()
                    .collect(java.util.stream.Collectors.toMap(AttendanceLog::getUserId, l -> l, (a, b) -> a));

            // Iterate ALL users to generate roster
            for (Integer userId : allUserIds) {
                AttendanceResponseDTO dto = new AttendanceResponseDTO();
                dto.setUserId(userId);
                dto.setDate(date);

                // Name
                if (nameMap.containsKey(userId)) {
                    String[] names = nameMap.get(userId);
                    dto.setFirstName(names[0]);
                    dto.setLastName(names[1]);
                }

                // Role
                dto.setRole(roleMap.getOrDefault(userId, "MEMBER"));

                // Status
                if (logMap.containsKey(userId)) {
                    var log = logMap.get(userId);
                    dto.setId(log.getId());
                    dto.setStatus(log.getStatus()); // PRESENT
                    // Role from log might be better if user changed roles, but current role is fine
                } else {
                    dto.setStatus("ABSENT");
                    // id is null
                }
                records.add(dto);
            }

        } else {
            // === HISTORY VIEW (Existing Logic - Only PRESENT) ===
            // 🚨 IMPROVEMENT: If no logs exist, ensure we still return users with 'ABSENT'
            // for today
            // to avoid empty list feeling like it didn't work.
            List<AttendanceLog> logs = attendanceRepository.findByUserIdInOrderByDateDesc(allUserIds);

            if (logs.isEmpty()) {
                // Fallback to roster-style daily view for TODAY if history is empty
                return getGymAttendance(gymId, sortBy, direction, LocalDate.now(), adminId);
            }

            records = logs.stream()
                    .map(this::toDTO)
                    .map(dto -> {
                        if (nameMap.containsKey(dto.getUserId())) {
                            String[] names = nameMap.get(dto.getUserId());
                            dto.setFirstName(names[0]);
                            dto.setLastName(names[1]);
                        }
                        return dto;
                    })
                    .collect(java.util.stream.Collectors.toList());
        }

        // 4. SORTING
        java.util.Comparator<AttendanceResponseDTO> comparator = null;

        if ("name".equalsIgnoreCase(sortBy)) {
            comparator = java.util.Comparator
                    .comparing(AttendanceResponseDTO::getFirstName, (s1, s2) -> {
                        if (s1 == null)
                            return s2 == null ? 0 : -1;
                        if (s2 == null)
                            return 1;
                        return s1.compareToIgnoreCase(s2);
                    })
                    .thenComparing(AttendanceResponseDTO::getLastName, (l1, l2) -> {
                        if (l1 == null)
                            return l2 == null ? 0 : -1;
                        if (l2 == null)
                            return 1;
                        return l1.compareToIgnoreCase(l2);
                    });
        } else {
            comparator = java.util.Comparator.comparing(AttendanceResponseDTO::getDate,
                    java.util.Comparator.nullsLast(java.util.Comparator.naturalOrder()));
        }

        if ("desc".equalsIgnoreCase(direction)) {
            comparator = comparator.reversed();
        }

        records.sort(comparator);

        AdminGymAttendanceDTO resultDTO = new AdminGymAttendanceDTO();
        resultDTO.setGymId(gymId != null ? gymId.intValue() : 0);
        resultDTO.setRecords(records);

        return resultDTO;
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

    // ADMIN UPDATE ATTENDANCE
    public void updateAttendance(Integer userId, LocalDate date, String status) {
        var existing = attendanceRepository.findByUserIdAndDate(userId, date);

        if ("ABSENT".equalsIgnoreCase(status)) {
            // Delete if exists
            existing.ifPresent(attendanceRepository::delete);
        } else if ("PRESENT".equalsIgnoreCase(status)) {
            // Create if missing
            if (existing.isEmpty()) {
                AttendanceLog log = new AttendanceLog();
                log.setUserId(userId);
                log.setDate(date);
                log.setStatus("PRESENT");
                // Need to fetch role? Or default to MEMBER/TRAINER if possible
                // For simplicity, let's fetch user role via member/trainer repo or just look up
                // user
                // Let's defer role setup or set a default.
                // Ideally we should lookup "Member" or "Trainer" to set correct role string
                // But for now, let's look up if they are Trainer first
                if (trainerRepository.findByUser_UserId(userId).isPresent()) {
                    log.setRole("TRAINER");
                } else {
                    log.setRole("MEMBER");
                }
                attendanceRepository.save(log);
            }
        }
    }
}
