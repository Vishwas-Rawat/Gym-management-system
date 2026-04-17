package com.gymmanagement.usermanagement.service;

import com.gymmanagement.commonservices.entity.MasterExercise;
import java.util.List;
import java.util.Map;

public interface ExerciseService {
    Map<String, List<Map<String, String>>> getExerciseDictionary();

    List<MasterExercise> searchExercises(String query, Integer userId);

    MasterExercise addExercise(MasterExercise exercise, Integer userId);
}
