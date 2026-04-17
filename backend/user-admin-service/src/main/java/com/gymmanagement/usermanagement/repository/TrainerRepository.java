package com.gymmanagement.usermanagement.repository;

import com.gymmanagement.commonservices.entity.Trainer;
import com.gymmanagement.commonservices.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TrainerRepository extends JpaRepository<Trainer, Integer> {

  List<Trainer> findByUser_UserId(Integer userId);

  List<Trainer> findByUser(User user);

  @Query("SELECT t FROM Trainer t WHERE t.user = :user AND t.gym = :gym")
  Optional<Trainer> findByUserAndGym(@Param("user") User user,
      @Param("gym") com.gymmanagement.commonservices.entity.Gym gym);

  // Only active trainers
  @Query("SELECT t FROM Trainer t WHERE t.isActive = true AND t.deleted = false AND t.gym.isActive = true")
  List<Trainer> findAllActive();

  @Query("SELECT t FROM Trainer t WHERE t.trainerId = :id AND t.isActive = true AND t.deleted = false")
  Optional<Trainer> findActiveById(@Param("id") Integer id);

  // SEARCH — FIXED: phoneNumber (no comments!)
  @Query("""
      SELECT t FROM Trainer t
      WHERE t.isActive = true AND t.deleted = false
        AND (
              LOWER(t.user.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(t.user.phoneNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(COALESCE(t.user.userProfile.firstName, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(COALESCE(t.user.userProfile.lastName, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(t.specialization) LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
      """)
  List<Trainer> searchActiveTrainers(@Param("keyword") String keyword);

  @Query("""
      SELECT t FROM Trainer t
      WHERE t.gym.createdByAdmin.userId = :adminId
        AND t.gym.isActive = true
        AND t.isActive = true AND t.deleted = false
        AND (
              LOWER(t.user.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(t.user.phoneNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(COALESCE(t.user.userProfile.firstName, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(COALESCE(t.user.userProfile.lastName, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(t.specialization) LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
      """)
  List<Trainer> searchActiveTrainersByAdminId(@Param("keyword") String keyword, @Param("adminId") Integer adminId);

  // BY GYM
  @Query("SELECT t FROM Trainer t WHERE t.gym.gymId = :gymId AND t.gym.isActive = true AND t.isActive = true AND t.deleted = false")
  List<Trainer> findActiveTrainersByGymId(@Param("gymId") Long gymId);

  @Query("SELECT t FROM Trainer t WHERE t.gym.gymId = :gymId AND t.gym.isActive = true AND t.isActive = true")
  List<Trainer> findActiveTrainers(Long gymId);

  @Query("SELECT t FROM Trainer t WHERE t.gym.createdByAdmin.userId = :adminId AND t.gym.isActive = true AND t.isActive = true AND t.deleted = false")
  List<Trainer> findActiveTrainersByAdminId(@Param("adminId") Integer adminId);

  @Query("SELECT COUNT(t) FROM Trainer t WHERE t.gym.gymId = :gymId AND t.gym.isActive = true AND t.isActive = true AND t.deleted = false")
  long countActiveTrainers(@Param("gymId") Long gymId);

}