// src/main/java/com/gymmanagement/usermanagement/controller/FoodController.java
package com.gymmanagement.usermanagement.controller;

import com.gymmanagement.commonservices.entity.*;
import com.gymmanagement.usermanagement.Request.CreateCustomFoodRequest;
import com.gymmanagement.usermanagement.Request.LogFoodRequest;
import com.gymmanagement.usermanagement.Response.*;
import com.gymmanagement.usermanagement.repository.*;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/foods")
@RequiredArgsConstructor
public class FoodController {

    private final FoodItemRepository foodRepo;
    private final CustomFoodItemRepository customFoodRepo;
    private final DietLogRepository logRepo;
    private final MemberRepository memberRepository;

    @GetMapping("/search")
    @PreAuthorize("hasRole('MEMBER')")
    public List<FoodSearchResponse> search(@RequestParam String q, Authentication auth) {
        Integer memberId = extractMemberId(auth);

        List<Object[]> results = foodRepo.searchGlobalAndCustom(q, memberId);

        return results.stream().map(row -> {
            FoodSearchResponse res = new FoodSearchResponse();
            res.setId(((Number) row[0]).longValue());
            res.setName((String) row[1]);
            res.setCategory((String) row[2]);
            res.setCaloriesPer100g(toDouble(row[3]));
            res.setProteinPer100g(toDouble(row[4]));
            res.setCarbsPer100g(toDouble(row[5]));
            res.setFatPer100g(toDouble(row[6]));
            res.setFiberPer100g(toDouble(row[7]));
            res.setServingUnit((String) row[8]);
            res.setType((String) row[11]); // "GLOBAL" or "CUSTOM"
            return res;
        }).toList();
    }

    // Helper to handle BigDecimal / Double safely
    private Double toDouble(Object obj) {
        return obj == null ? 0.0 : ((Number) obj).doubleValue();
    }

    // 2. Popular global foods
    @GetMapping("/popular")
    public List<FoodItem> popular() {
        return foodRepo.findTop20ByOrderByPopularityDesc();
    }

    // 3. My custom foods only
    @GetMapping("/my-foods")
    @PreAuthorize("hasRole('MEMBER')")
    public List<CustomFoodItem> myFoods(Authentication auth) {
        Integer memberId = extractMemberId(auth);
        return customFoodRepo.findByMemberIdOrderByCreatedAtDesc(memberId);
    }

    // 4. Add custom food
    @PostMapping("/custom")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<CustomFoodItem> addCustomFood(
            @RequestBody CreateCustomFoodRequest req,
            Authentication auth) {

        Integer memberId = extractMemberId(auth);

        CustomFoodItem food = new CustomFoodItem();
        food.setMemberId(memberId);
        food.setName(req.name());
        food.setCaloriesPer100g(toBig(req.caloriesPer100g()));
        food.setProteinPer100g(toBig(req.proteinPer100g()));
        food.setCarbsPer100g(toBig(req.carbsPer100g()));
        food.setFatPer100g(toBig(req.fatPer100g()));
        food.setFiberPer100g(toBig(req.fiberPer100g()));
        food.setServingUnit(req.servingUnit() != null ? req.servingUnit() : "100g");

        customFoodRepo.save(food);
        return ResponseEntity.ok(food);
    }

    // **Single correct toBig helper**
    private BigDecimal toBig(Number value) {
        return value != null ? BigDecimal.valueOf(value.doubleValue()) : BigDecimal.ZERO;
    }

    // 5. Log food (existing)
    @PostMapping("/log")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<LogFoodResponse> logFood(
            @RequestBody LogFoodRequest req,
            Authentication auth) {

        Integer memberId = extractMemberId(auth);

        FoodItem globalFood = foodRepo.findById(req.foodId()).orElse(null);
        CustomFoodItem customFood = null;

        if (globalFood == null) {
            customFood = customFoodRepo.findById(req.foodId())
                    .orElseThrow(() -> new RuntimeException("Food not found"));
        }

        double multiplier = req.quantity() / 100.0;
        BigDecimal mul = BigDecimal.valueOf(multiplier);

        DietLog log = new DietLog();
        log.setMemberId(memberId);
        log.setDate(req.date() != null ? req.date() : LocalDate.now());
        log.setMealName(req.mealName());

        if (globalFood != null) {
            log.setFoodId(globalFood.getId());
            log.setFoodName(globalFood.getName());
            log.setCalories(toBig(globalFood.getCaloriesPer100g()).multiply(mul).doubleValue());
            log.setProtein(toBig(globalFood.getProteinPer100g()).multiply(mul).doubleValue());
            log.setCarbs(toBig(globalFood.getCarbsPer100g()).multiply(mul).doubleValue());
            log.setFat(toBig(globalFood.getFatPer100g()).multiply(mul).doubleValue());
        } else {
            log.setFoodId(customFood.getId());
            log.setFoodName(customFood.getName());
            log.setCalories(customFood.getCaloriesPer100g().multiply(mul).doubleValue());
            log.setProtein(customFood.getProteinPer100g().multiply(mul).doubleValue());
            log.setCarbs(customFood.getCarbsPer100g().multiply(mul).doubleValue());
            log.setFat(customFood.getFatPer100g().multiply(mul).doubleValue());
        }

        log.setQuantity(req.quantity());
        logRepo.save(log);

        return ResponseEntity.ok(new LogFoodResponse(
                log.getLogId(),
                "Food logged successfully!",
                log.getCalories()
        ));
    }

    private Integer extractMemberId(Authentication auth) {
        User user = (User) auth.getPrincipal();
        return memberRepository.findByUser_UserId(user.getUserId())
                .map(Member::getMemberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
    }
}
