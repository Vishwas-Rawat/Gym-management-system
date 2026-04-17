package com.gymmanagement.trainer.trainer_panel.repository;

import com.gymmanagement.commonservices.entity.MasterFoodItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MasterFoodItemRepository extends JpaRepository<MasterFoodItem, Long> {

    @Query("SELECT f FROM MasterFoodItem f WHERE LOWER(f.name) LIKE LOWER(CONCAT('%', :query, '%')) AND (f.createdByMemberId IS NULL OR f.createdByMemberId = :memberId)")
    Page<MasterFoodItem> searchFood(@Param("query") String query, @Param("memberId") Integer memberId, Pageable pageable);
}
