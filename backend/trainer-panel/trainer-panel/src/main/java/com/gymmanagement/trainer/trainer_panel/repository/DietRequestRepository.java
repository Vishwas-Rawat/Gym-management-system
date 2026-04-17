package com.gymmanagement.trainer.trainer_panel.repository;

import com.gymmanagement.commonservices.entity.DietRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface DietRequestRepository extends JpaRepository<DietRequest, Integer> {
    List<DietRequest> findByTrainerIdOrderByCreatedAtDesc(Integer trainerId);

    List<DietRequest> findByMemberIdOrderByCreatedAtDesc(Integer memberId);

    @Query("SELECT new com.gymmanagement.trainer.trainer_panel.dto.ChartDataDTO(CAST(d.status AS string), COUNT(d)) " +
            "FROM DietRequest d WHERE d.trainerId = :trainerId " +
            "GROUP BY d.status")
    List<com.gymmanagement.trainer.trainer_panel.dto.ChartDataDTO> countByStatus(@Param("trainerId") Integer trainerId);
}
