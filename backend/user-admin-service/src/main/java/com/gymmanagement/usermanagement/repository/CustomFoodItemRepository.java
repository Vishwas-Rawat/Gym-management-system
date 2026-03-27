package com.gymmanagement.usermanagement.repository;

import com.gymmanagement.commonservices.entity.CustomFoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CustomFoodItemRepository extends JpaRepository<CustomFoodItem, Long> {
    List<CustomFoodItem> findByMemberIdOrderByCreatedAtDesc(Integer memberId);
}