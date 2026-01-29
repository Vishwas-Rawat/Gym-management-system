package com.gymmanagement.trainer.trainer_panel.service;

import com.gymmanagement.commonservices.entity.MasterExercise;
import com.gymmanagement.commonservices.entity.MemberWorkoutLog;
import com.gymmanagement.trainer.trainer_panel.dto.LogWorkoutRequest;
import com.gymmanagement.trainer.trainer_panel.repository.MasterExerciseRepository;
import com.gymmanagement.trainer.trainer_panel.repository.MemberWorkoutLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkoutLogService {

    private final MasterExerciseRepository exerciseRepo;
    private final MemberWorkoutLogRepository logRepo;

    // --- EXERCISE DATABASE ---
    public List<MasterExercise> searchExercises(String query, Integer memberId) {
        return exerciseRepo.searchExercises(query, memberId);
    }

    public MasterExercise addExerciseToDatabase(MasterExercise exercise, Integer memberId) {
        if (memberId != null) {
            exercise.setCreatedByMemberId(memberId);
        }
        return exerciseRepo.save(exercise);
    }

    public List<MasterExercise> getAllGlobalExercises() {
        return exerciseRepo.findByCreatedByMemberIdIsNull();
    }

    // --- WORKOUT LOGGING ---
    // --- WORKOUT LOGGING ---
    public List<MemberWorkoutLog> logWorkouts(Integer memberId, List<LogWorkoutRequest> requests) {
        // Validate all exercises first
        List<MemberWorkoutLog> logs = requests.stream().map(req -> {
            MasterExercise ex = exerciseRepo.findById(req.getExerciseId())
                    .orElseThrow(() -> new IllegalArgumentException("Exercise not found: " + req.getExerciseId()));

            MemberWorkoutLog log = new MemberWorkoutLog();
            log.setMemberId(memberId);
            log.setDate(req.getDate());
            log.setExercise(ex);
            log.setSets(req.getSets());
            log.setReps(req.getReps());
            log.setWeightKg(req.getWeightKg());
            return log;
        }).toList();

        return logRepo.saveAll(logs);
    }

    public List<MemberWorkoutLog> getDailyLog(Integer memberId, LocalDate date) {
        return logRepo.findByMemberIdAndDate(memberId, date);
    }

    // --- UPDATE & DELETE (NEW) ---

    public void deleteLog(Integer memberId, Long logId) {
        MemberWorkoutLog log = logRepo.findById(logId)
                .orElseThrow(() -> new IllegalArgumentException("Log not found"));

        if (!log.getMemberId().equals(memberId)) {
            throw new RuntimeException("Unauthorized: You can only delete your own logs");
        }
        logRepo.delete(log);
    }

    public MemberWorkoutLog updateLog(Integer memberId, Long logId, LogWorkoutRequest req) {
        MemberWorkoutLog log = logRepo.findById(logId)
                .orElseThrow(() -> new IllegalArgumentException("Log not found"));

        if (!log.getMemberId().equals(memberId)) {
            throw new RuntimeException("Unauthorized: You can only update your own logs");
        }

        if (req.getSets() != null)
            log.setSets(req.getSets());
        if (req.getReps() != null)
            log.setReps(req.getReps());
        if (req.getWeightKg() != null)
            log.setWeightKg(req.getWeightKg());

        return logRepo.save(log);
    }
}
