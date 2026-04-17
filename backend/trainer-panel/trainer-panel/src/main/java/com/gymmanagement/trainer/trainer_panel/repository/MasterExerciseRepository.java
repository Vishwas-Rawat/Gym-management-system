package com.gymmanagement.trainer.trainer_panel.repository;

import com.gymmanagement.commonservices.entity.MasterExercise;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MasterExerciseRepository extends JpaRepository<MasterExercise, Long> {

    @Query("SELECT e FROM MasterExercise e WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', :query, '%')) AND (e.createdByMemberId IS NULL OR e.createdByMemberId = :memberId)")
    Page<MasterExercise> searchExercises(@Param("query") String query, @Param("memberId") Integer memberId, Pageable pageable);

    // Fetch Global Exercises (Dictionary Base)
    List<MasterExercise> findByCreatedByMemberIdIsNull();
}
