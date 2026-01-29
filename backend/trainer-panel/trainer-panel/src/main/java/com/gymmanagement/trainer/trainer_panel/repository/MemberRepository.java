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

}
