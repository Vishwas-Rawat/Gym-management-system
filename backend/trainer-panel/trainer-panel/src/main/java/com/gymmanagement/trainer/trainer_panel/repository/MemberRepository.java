package com.gymmanagement.trainer.trainer_panel.repository;

import com.gymmanagement.commonservices.entity.Member;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<Member, Integer> {
    Optional<Member> findByUser_UserId(Integer userId);

    List<Member> findByGym_GymId(Long gymId);

    List<Member> findByGym_CreatedByAdmin_UserId(Integer adminId);

    List<Member> findByGym_GymIdIn(List<Long> gymIds);

    List<Member> findByTrainer_TrainerId(Integer trainerId);

    @Query("SELECT m FROM Member m JOIN m.user u LEFT JOIN u.userProfile p " +
            "WHERE m.gym.gymId = :gymId AND (" +
            "u.username LIKE %:query% OR p.firstName LIKE %:query% OR p.lastName LIKE %:query%)")
    List<Member> searchByGymAndName(@Param("gymId") Long gymId, @Param("query") String query);

    @Query("SELECT new com.gymmanagement.trainer.trainer_panel.dto.ChartDataDTO(m.fitnessGoal, COUNT(m)) " +
            "FROM Member m WHERE m.trainer.trainerId = :trainerId AND m.isActive = true " +
            "GROUP BY m.fitnessGoal")
    List<com.gymmanagement.trainer.trainer_panel.dto.ChartDataDTO> countByFitnessGoal(
            @Param("trainerId") Integer trainerId);

    @Query("SELECT new com.gymmanagement.trainer.trainer_panel.dto.TimeChartDataDTO(m.joiningDate, COUNT(m)) " +
            "FROM Member m WHERE m.trainer.trainerId = :trainerId AND m.joiningDate >= :startDate " +
            "GROUP BY m.joiningDate ORDER BY m.joiningDate ASC")
    List<com.gymmanagement.trainer.trainer_panel.dto.TimeChartDataDTO> getEnrollmentTrend(
            @Param("trainerId") Integer trainerId, @Param("startDate") java.time.LocalDate startDate);

}
