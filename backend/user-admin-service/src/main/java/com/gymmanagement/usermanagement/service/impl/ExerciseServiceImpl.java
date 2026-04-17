package com.gymmanagement.usermanagement.service.impl;

import com.gymmanagement.commonservices.entity.MasterExercise;
import com.gymmanagement.commonservices.enumeration.ExerciseName;
import com.gymmanagement.usermanagement.repository.MasterExerciseRepository;
import com.gymmanagement.usermanagement.service.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExerciseServiceImpl implements ExerciseService {

    private final MasterExerciseRepository exerciseRepository;

    @Override
    public Map<String, List<Map<String, String>>> getExerciseDictionary() {
        Map<String, List<Map<String, String>>> dictionary = new HashMap<>();

        // 1. Load from Enum
        for (ExerciseName e : ExerciseName.values()) {
            Map<String, String> option = new HashMap<>();
            option.put("code", e.name());
            option.put("displayName", e.getDisplayName());
            dictionary.computeIfAbsent(e.getMuscleGroup(), k -> new ArrayList<>()).add(option);
        }

        // 2. Load from DB
        List<MasterExercise> globalExercises = exerciseRepository.findByCreatedByMemberIdIsNull();
        for (MasterExercise ex : globalExercises) {
            String group = (ex.getTargetMuscleGroup() != null) ? ex.getTargetMuscleGroup() : "Custom";
            Map<String, String> option = new HashMap<>();
            option.put("code", ex.getName());
            option.put("displayName", ex.getName());
            dictionary.computeIfAbsent(group, k -> new ArrayList<>()).add(option);
        }

        return dictionary;
    }

    @Override
    public List<MasterExercise> searchExercises(String query, Integer userId) {
        return exerciseRepository.searchExercises(query, userId);
    }

    @Override
    public MasterExercise addExercise(MasterExercise exercise, Integer userId) {
        if (userId != null) {
            exercise.setCreatedByMemberId(userId);
        }
        return exerciseRepository.save(exercise);
    }
}
