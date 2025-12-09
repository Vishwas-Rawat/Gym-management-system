package com.gymmanagement.trainer.trainer_panel.service;

import com.gymmanagement.commonservices.entity.*;
import com.gymmanagement.trainer.trainer_panel.client.UserManagementClient;
import com.gymmanagement.trainer.trainer_panel.dto.*;
import com.gymmanagement.trainer.trainer_panel.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
@RequiredArgsConstructor
public class DietServiceImpl implements DietService {

    private final DietPlanRepository dietPlanRepo;
    private final DietLogRepository dietLogRepo;
    private final DietMealRepository mealRepo;
    private final DietFoodRepository foodRepo;
    private final DietProteinRepository proteinRepo;
    private final MemberRepository memberRepo;
    private final TrainerRepository trainerRepo;
    private final UserManagementClient userClient;

    @Override
    public DietPlanResponse assignDietPlan(Integer trainerId, AssignDietRequest req) {

        // validate member exists
        memberRepo.findById(req.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));

        DietPlan plan = dietPlanRepo.findFirstByMemberIdOrderByCreatedAtDesc(req.getMemberId())
                .orElse(null);

        if (plan == null) {
            plan = new DietPlan();
            plan.setMemberId(req.getMemberId());
            plan.setTrainerId(trainerId);
            plan.setCreatedAt(LocalDateTime.now());
        } else {
            mealRepo.deleteAll(plan.getMeals());
            plan.getMeals().clear();
        }

        plan.setPlanName(req.getPlanName());
        plan.setDietType(req.getDietType());
        dietPlanRepo.save(plan);

        if (req.getMeals() != null) {
            for (MealDto dto : req.getMeals()) {

                DietMeal meal = new DietMeal();
                meal.setDietPlan(plan);
                meal.setMealName(dto.getMealName());
                meal = mealRepo.save(meal);

                if (dto.getFoods() != null) {
                    for (FoodDto foodDto : dto.getFoods()) {
                        DietFood food = new DietFood();
                        food.setMeal(meal);
                        food.setFoodName(foodDto.getFoodName());
                        food.setQuantity(foodDto.getQuantity());
                        food.setNotes(foodDto.getNotes());
                        foodRepo.save(food);
                        meal.getFoods().add(food);
                    }
                }

                if (dto.getProtein() != null) {
                    ProteinDto p = dto.getProtein();
                    DietProtein protein = new DietProtein();
                    protein.setMeal(meal);
                    protein.setProteinName(p.getProteinName());
                    protein.setProteinQuantity(p.getProteinQuantity());
                    proteinRepo.save(protein);
                    meal.setProtein(protein);
                }

                plan.getMeals().add(meal);
            }
        }

        dietPlanRepo.save(plan);

        return buildResponse(plan);
    }

    @Override
    public void logDiet(Integer memberId, DietLogRequest req) {
        DietLog log = new DietLog();
        log.setMemberId(memberId);
        log.setDate(java.time.LocalDate.now());
        log.setMealName(req.getMealName());
        log.setFoodName(req.getFoodName());
        log.setQuantity(req.getQuantity());
        log.setCalories(req.getCalories());
        log.setProtein(req.getProtein());
        log.setCarbs(req.getCarbs());
        log.setFat(req.getFat());
        log.setLoggedAt(LocalDateTime.now());
        dietLogRepo.save(log);
    }

    @Override
    public java.util.List<DietLog> getTodayLogs(Integer memberId) {
        return dietLogRepo.findByMemberIdAndDate(memberId, java.time.LocalDate.now());
    }

    @Override
    public java.util.List<DietLog> getHistory(Integer memberId) {
        return dietLogRepo.findByMemberIdAndDateBetween(memberId, java.time.LocalDate.now().minusDays(30),
                java.time.LocalDate.now());
    }

    @Override
    public DietPlanResponse getLatestDietForMember(Integer memberId) {
        DietPlan plan = dietPlanRepo.findFirstByMemberIdOrderByCreatedAtDesc(memberId)
                .orElse(null);

        if (plan == null) {
            return null;
        }

        return buildResponse(plan);
    }

    private DietPlanResponse buildResponse(DietPlan plan) {

        DietPlanResponse res = new DietPlanResponse();
        res.setPlanId(plan.getPlanId());
        res.setPlanName(plan.getPlanName());
        res.setDietType(plan.getDietType().name());
        res.setMemberId(plan.getMemberId());
        res.setTrainerId(plan.getTrainerId());
        res.setCreatedAt(plan.getCreatedAt());

        // trainer name
        try {
            var trainer = trainerRepo.findById(plan.getTrainerId()).orElse(null);
            if (trainer != null) {
                UserProfileResponse profile = userClient.getUserProfile(trainer.getUser().getUserId());
                if (profile != null) {
                    res.setTrainerName(profile.getFirstName() + " " + profile.getLastName());
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch trainer profile: " + e.getMessage());
        }

        // member name
        try {
            var member = memberRepo.findById(plan.getMemberId()).orElse(null);
            if (member != null) {
                UserProfileResponse profile = userClient.getUserProfile(member.getUser().getUserId());
                if (profile != null) {
                    res.setMemberName(profile.getFirstName() + " " + profile.getLastName());
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch member profile: " + e.getMessage());
        }

        // meals
        java.util.List<MealResponse> meals = new java.util.ArrayList<>();
        for (DietMeal meal : plan.getMeals()) {

            MealResponse m = new MealResponse();
            m.setMealName(meal.getMealName().name());

            java.util.List<FoodDto> foods = new java.util.ArrayList<>();
            for (DietFood f : meal.getFoods()) {
                FoodDto fd = new FoodDto();
                fd.setFoodName(f.getFoodName());
                fd.setQuantity(f.getQuantity());
                fd.setNotes(f.getNotes());
                foods.add(fd);
            }
            m.setFoods(foods);

            if (meal.getProtein() != null) {
                ProteinDto pd = new ProteinDto();
                pd.setProteinName(meal.getProtein().getProteinName());
                pd.setProteinQuantity(meal.getProtein().getProteinQuantity());
                m.setProtein(pd);
            }

            meals.add(m);
        }

        res.setMeals(meals);
        return res;
    }
}
