package com.gymmanagement.usermanagement.repository;

import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.commonservices.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Integer> {

  List<Member> findByUser(User user);

  // ✅ Multi-Gym Support
  @Query("SELECT m FROM Member m WHERE m.user = :user AND m.gym = :gym AND m.deletedAt IS NULL")
  Optional<Member> findByUserAndGym(@Param("user") User user,
      @Param("gym") com.gymmanagement.commonservices.entity.Gym gym);

  @Query("SELECT COUNT(m) > 0 FROM Member m WHERE m.user = :user AND m.gym = :gym AND m.deletedAt IS NULL")
  boolean existsByUserAndGym(@Param("user") User user, @Param("gym") com.gymmanagement.commonservices.entity.Gym gym);

  // ACTIVE MEMBERS ONLY
  @Query("SELECT m FROM Member m WHERE m.isActive = true AND m.deletedAt IS NULL")
  List<Member> findAllActive();

  @Query("SELECT m FROM Member m WHERE m.memberId = :id AND m.isActive = true AND m.deletedAt IS NULL")
  Optional<Member> findActiveById(@Param("id") Integer id);

  // FIXED: Now searches in UserProfile (safe with COALESCE to avoid NPE)
  @Query("""
      SELECT m FROM Member m
      WHERE m.isActive = true
        AND m.deletedAt IS NULL
        AND m.gym.isActive = true
        AND (
              LOWER(m.user.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(COALESCE(m.user.phoneNumber, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(COALESCE(m.user.userProfile.firstName, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(COALESCE(m.user.userProfile.lastName, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
           OR LOWER(COALESCE(m.membershipPlan, '')) LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
      """)
  List<Member> searchActiveMembers(@Param("keyword") String keyword);

  @Query("""
      SELECT m FROM Member m
      WHERE m.gym.gymId = :gymId
        AND m.gym.isActive = true
        AND m.isActive = true
        AND m.deletedAt IS NULL
      """)
  List<Member> findActiveMembersByGymId(@Param("gymId") Long gymId);

  @Query("SELECT m FROM Member m WHERE m.trainer.trainerId = :trainerId AND m.isActive = true AND m.deletedAt IS NULL")
  List<Member> findActiveMembersByTrainerId(@Param("trainerId") Integer trainerId);

  @Query("""
      SELECT m FROM Member m
      WHERE m.trainer.trainerId = :trainerId
        AND m.gym.gymId = :gymId
        AND m.isActive = true
        AND m.deletedAt IS NULL
      """)
  List<Member> findActiveMembersByTrainerIdAndGymId(
      @Param("trainerId") Integer trainerId,
      @Param("gymId") Long gymId);

  @Query("SELECT COUNT(m) FROM Member m WHERE m.gym.gymId = :gymId AND m.isActive = true")
  long countActiveMembers(Long gymId);

  @Query("SELECT m FROM Member m WHERE m.gym.gymId = :gymId AND m.planStartDate IS NOT NULL")
  List<Member> findAllByGym(Long gymId);

  @Query("""
      SELECT m FROM Member m
      WHERE m.gym.createdByAdmin.userId = :adminId
        AND m.gym.isActive = true
        AND m.isActive = true
        AND m.deletedAt IS NULL
      """)
  List<Member> findActiveMembersByAdminId(@Param("adminId") Integer adminId);

  long countByGym_GymId(Long gymId);

}