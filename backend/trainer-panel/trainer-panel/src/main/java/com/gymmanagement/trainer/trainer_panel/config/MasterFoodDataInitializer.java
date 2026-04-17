package com.gymmanagement.trainer.trainer_panel.config;

import com.gymmanagement.commonservices.entity.MasterFoodItem;
import com.gymmanagement.trainer.trainer_panel.repository.MasterFoodItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class MasterFoodDataInitializer implements CommandLineRunner {

    private final MasterFoodItemRepository foodRepo;

    @Override
    public void run(String... args) throws Exception {
        if (foodRepo.count() == 0) {
            System.out.println("SEEDING MASTER FOOD DATA...");
            List<MasterFoodItem> items = new ArrayList<>();

            items.add(createItem("Chicken Breast", 165.0, 31.0, 0.0, 3.6, "grams"));
            items.add(createItem("Whole Egg", 155.0, 13.0, 1.1, 11.0, "grams"));
            items.add(createItem("Oats", 389.0, 17.0, 66.0, 7.0, "grams"));
            items.add(createItem("White Rice (Cooked)", 130.0, 2.7, 28.0, 0.3, "grams"));
            items.add(createItem("Brown Rice (Cooked)", 111.0, 2.6, 23.0, 0.9, "grams"));
            items.add(createItem("Broccoli", 34.0, 2.8, 7.0, 0.4, "grams"));
            items.add(createItem("Almonds", 579.0, 21.0, 22.0, 50.0, "grams"));
            items.add(createItem("Peanut Butter", 588.0, 25.0, 20.0, 50.0, "grams"));
            items.add(createItem("Greek Yogurt (Plain)", 59.0, 10.0, 3.6, 0.4, "grams"));
            items.add(createItem("Banana", 89.0, 1.1, 23.0, 0.3, "grams"));
            items.add(createItem("Whole Milk", 61.0, 3.2, 4.8, 3.3, "ml"));
            items.add(createItem("Salmon", 208.0, 20.0, 0.0, 13.0, "grams"));
            items.add(createItem("Sweet Potato", 86.0, 1.6, 20.0, 0.1, "grams"));
            items.add(createItem("Spinach", 23.0, 2.9, 3.6, 0.4, "grams"));
            items.add(createItem("Olive Oil", 884.0, 0.0, 0.0, 100.0, "ml"));
            items.add(createItem("Whole Wheat Bread", 247.0, 13.0, 41.0, 3.4, "grams"));
            items.add(createItem("Lean Beef", 250.0, 26.0, 0.0, 15.0, "grams"));
            items.add(createItem("Avocado", 160.0, 2.0, 9.0, 15.0, "grams"));
            items.add(createItem("Lentils", 116.0, 9.0, 20.0, 0.4, "grams"));
            items.add(createItem("Chickpeas", 164.0, 8.9, 27.0, 2.6, "grams"));

            foodRepo.saveAll(items);
            System.out.println("SUCCESSFULLY SEEDED " + items.size() + " FOOD ITEMS.");
        }
    }

    private MasterFoodItem createItem(String name, Double cal, Double pro, Double carb, Double fat, String unit) {
        MasterFoodItem item = new MasterFoodItem();
        item.setName(name);
        item.setCaloriesPer100g(cal);
        item.setProteinPer100g(pro);
        item.setCarbsPer100g(carb);
        item.setFatPer100g(fat);
        item.setServingUnit(unit);
        item.setCreatedByMemberId(null); // Global
        return item;
    }
}
