package com.gymmanagement.trainer.trainer_panel.config;

import com.gymmanagement.commonservices.entity.MasterExercise;
import com.gymmanagement.commonservices.enumeration.ExerciseName;
import com.gymmanagement.trainer.trainer_panel.repository.MasterExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class MasterExerciseDataInitializer implements CommandLineRunner {

    private final MasterExerciseRepository exerciseRepo;

    @Override
    public void run(String... args) throws Exception {
        if (exerciseRepo.count() == 0) {
            System.out.println("SEEDING MASTER EXERCISE DATA...");
            List<MasterExercise> items = new ArrayList<>();

            for (ExerciseName en : ExerciseName.values()) {
                items.add(createExercise(en.getDisplayName(), en.getMuscleGroup()));
            }

            exerciseRepo.saveAll(items);
            System.out.println("SUCCESSFULLY SEEDED " + items.size() + " EXERCISE ITEMS.");
        }
    }

    private MasterExercise createExercise(String name, String group) {
        MasterExercise ex = new MasterExercise();
        ex.setName(name);
        ex.setTargetMuscleGroup(group);
        ex.setCreatedByMemberId(null); // Global
        return ex;
    }
}
