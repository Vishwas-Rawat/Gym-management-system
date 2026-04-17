package com.gymmanagement.trainer.trainer_panel.repository;

import com.gymmanagement.commonservices.entity.MemberWorkoutLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MemberWorkoutLogRepository extends JpaRepository<MemberWorkoutLog, Long> {
        List<MemberWorkoutLog> findByMemberIdAndDate(Integer memberId, LocalDate date);

        @Query("SELECT new com.gymmanagement.trainer.trainer_panel.dto.TimeChartDataDTO(w.date, CAST(SUM(w.weightKg * w.sets * w.reps) AS long)) "
                        +
                        "FROM MemberWorkoutLog w WHERE w.date >= :startDate " +
                        "AND w.memberId IN (SELECT m.memberId FROM Member m WHERE m.trainer.trainerId = :trainerId) " +
                        "GROUP BY w.date ORDER BY w.date ASC")
        List<com.gymmanagement.trainer.trainer_panel.dto.TimeChartDataDTO> getWorkoutVolumeTrends(
                        @Param("trainerId") Integer trainerId, @Param("startDate") LocalDate startDate);

        @Query("SELECT new com.gymmanagement.trainer.trainer_panel.dto.ChartDataDTO(w.exercise.targetMuscleGroup, COUNT(w)) "
                        +
                        "FROM MemberWorkoutLog w WHERE w.memberId IN (SELECT m.memberId FROM Member m WHERE m.trainer.trainerId = :trainerId) "
                        +
                        "GROUP BY w.exercise.targetMuscleGroup")
        List<com.gymmanagement.trainer.trainer_panel.dto.ChartDataDTO> getMuscleFocusDistribution(
                        @Param("trainerId") Integer trainerId);

        @Query("SELECT new com.gymmanagement.trainer.trainer_panel.dto.TimeChartDataDTO(w.date, COUNT(DISTINCT w.memberId)) "
                        +
                        "FROM MemberWorkoutLog w WHERE w.date >= :startDate " +
                        "AND w.memberId IN (SELECT m.memberId FROM Member m WHERE m.trainer.trainerId = :trainerId) " +
                        "GROUP BY w.date")
        List<com.gymmanagement.trainer.trainer_panel.dto.TimeChartDataDTO> getActivityHeatmap(
                        @Param("trainerId") Integer trainerId, @Param("startDate") LocalDate startDate);
}
