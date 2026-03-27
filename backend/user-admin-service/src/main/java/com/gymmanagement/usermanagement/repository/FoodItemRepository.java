package com.gymmanagement.usermanagement.repository;

import com.gymmanagement.commonservices.entity.FoodItem;

import org.springframework.data.repository.query.Param;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {

    @Query("SELECT f FROM FoodItem f WHERE LOWER(f.name) LIKE LOWER(CONCAT('%', :query, '%')) ORDER BY f.popularity DESC, f.name")
    List<FoodItem> searchByName(String query);

    List<FoodItem> findTop20ByOrderByPopularityDesc();
    
//    @Query("SELECT f FROM FoodItem f WHERE LOWER(f.name) LIKE LOWER(CONCAT('%', :q, '%')) " +
//    	       "UNION " +
//    	       "SELECT c FROM CustomFoodItem c WHERE c.memberId = :memberId AND LOWER(c.name) LIKE LOWER(CONCAT('%', :q, '%'))")
//    	List<Object> searchAll(@Param("q") String q, @Param("memberId") Integer memberId);
//    
    
    @Query(value = """
    	    SELECT 
    	        id,
    	        name,
    	        category,
    	        CAST(calories_per100g AS DECIMAL(10,2)),
    	        CAST(protein_per100g AS DECIMAL(10,2)),
    	        CAST(carbs_per100g AS DECIMAL(10,2)),
    	        CAST(fat_per100g AS DECIMAL(10,2)),
    	        CAST(fiber_per100g AS DECIMAL(10,2)),
    	        serving_unit,
    	        NULL as member_id,
    	        NULL as created_at,
    	        'GLOBAL' as type
    	    FROM food_items 
    	    WHERE LOWER(name) LIKE LOWER(CONCAT('%', :q, '%'))

    	    UNION ALL

    	    SELECT
    	        id,
    	        name,
    	        NULL as category,
    	        CAST(calories_per100g AS DECIMAL(10,2)),
    	        CAST(protein_per100g AS DECIMAL(10,2)),
    	        CAST(carbs_per100g AS DECIMAL(10,2)),
    	        CAST(fat_per100g AS DECIMAL(10,2)),
    	        CAST(fiber_per100g AS DECIMAL(10,2)),
    	        serving_unit,
    	        member_id,
    	        created_at,
    	        'CUSTOM' as type
    	    FROM member_custom_foods
    	    WHERE member_id = :memberId
    	      AND LOWER(name) LIKE LOWER(CONCAT('%', :q, '%'))
    	    
    	    ORDER BY name
    	""", nativeQuery = true)
    	List<Object[]> searchGlobalAndCustom(@Param("q") String q, @Param("memberId") Integer memberId);


}