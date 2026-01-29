package com.gymmanagement.trainer.trainer_panel.service;

import com.gymmanagement.commonservices.entity.MasterFoodItem;
import com.gymmanagement.commonservices.entity.MemberDietLog;
import com.gymmanagement.trainer.trainer_panel.dto.DietLogResponse;
import com.gymmanagement.trainer.trainer_panel.dto.LogDietRequest;
import com.gymmanagement.trainer.trainer_panel.repository.MasterFoodItemRepository;
import com.gymmanagement.trainer.trainer_panel.repository.MemberDietLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DietLogService {

    private final MasterFoodItemRepository foodRepo;
    private final MemberDietLogRepository logRepo;

    // --- FOOD DATABASE ---
    public List<MasterFoodItem> searchFood(String query, Integer memberId) {
        return foodRepo.searchFood(query, memberId);
    }

    public MasterFoodItem addFoodToDatabase(MasterFoodItem item, Integer memberId) {
        if (memberId != null) {
            item.setCreatedByMemberId(memberId);
        }
        return foodRepo.save(item);
    }

    // --- DIET LOGGING ---
    // --- DIET LOGGING ---
    public List<MemberDietLog> logFoodList(Integer memberId, List<LogDietRequest> requests) {
        List<MemberDietLog> logs = requests.stream().map(req -> {
            MasterFoodItem food = foodRepo.findById(req.getFoodItemId())
                    .orElseThrow(() -> new IllegalArgumentException("Food item not found: " + req.getFoodItemId()));

            MemberDietLog log = new MemberDietLog();
            log.setMemberId(memberId);
            log.setDate(req.getDate());
            log.setMealName(req.getMealName());
            log.setFoodItem(food);
            log.setQuantity(req.getQuantity());

            // Calculate Macros
            double ratio = req.getQuantity() / 100.0;
            log.setTotalCalories(food.getCaloriesPer100g() * ratio);
            log.setTotalProtein(food.getProteinPer100g() * ratio);
            log.setTotalCarbs(food.getCarbsPer100g() * ratio);
            log.setTotalFat(food.getFatPer100g() * ratio);

            return log;
        }).toList();

        return logRepo.saveAll(logs);
    }

    public DietLogResponse getDailyLog(Integer memberId, LocalDate date) {
        List<MemberDietLog> logs = logRepo.findByMemberIdAndDate(memberId, date);
        return new DietLogResponse(date, logs);
    }

    // --- UPDATE & DELETE ---

    public void deleteLog(Integer memberId, Long logId) {
        MemberDietLog log = logRepo.findById(logId)
                .orElseThrow(() -> new IllegalArgumentException("Log entry not found"));

        if (!log.getMemberId().equals(memberId)) {
            throw new RuntimeException("Unauthorized: You can only delete your own logs");
        }
        logRepo.delete(log);
    }

    public MemberDietLog updateLog(Integer memberId, Long logId, LogDietRequest req) {
        MemberDietLog log = logRepo.findById(logId)
                .orElseThrow(() -> new IllegalArgumentException("Log entry not found"));

        if (!log.getMemberId().equals(memberId)) {
            throw new RuntimeException("Unauthorized: You can only update your own logs");
        }

        // Update basic fields
        if (req.getMealName() != null)
            log.setMealName(req.getMealName());

        // Use provided quantity or fallback to existing
        double newQuantity = (req.getQuantity() != null) ? req.getQuantity() : log.getQuantity();
        log.setQuantity(newQuantity);

        // Recalculate Macros
        MasterFoodItem food = log.getFoodItem(); // Keep same food
        double ratio = newQuantity / 100.0;

        log.setTotalCalories(food.getCaloriesPer100g() * ratio);
        log.setTotalProtein(food.getProteinPer100g() * ratio);
        log.setTotalCarbs(food.getCarbsPer100g() * ratio);
        log.setTotalFat(food.getFatPer100g() * ratio);

        return logRepo.save(log);
    }
}
