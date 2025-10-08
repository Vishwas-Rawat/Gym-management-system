//package com.gymmanagement.exercise.exercise_management.service.impl;
//
//import com.gymmanagement.commonservices.entity.*;
//import com.gymmanagement.exercise.exercise_management.dto.ExerciseRequest;
//import com.gymmanagement.exercise.exercise_management.dto.ExerciseResponse;
//import com.gymmanagement.exercise.exercise_management.repository.ExerciseRepository;
//import com.gymmanagement.exercise.exercise_management.repository.WorkoutPlanRepository;
//import com.gymmanagement.exercise.exercise_management.repository.WorkoutPlanItemRepository;
//import com.gymmanagement.exercise.exercise_management.service.ExerciseService;
//import jakarta.persistence.EntityNotFoundException;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//
//@Service
//public class ExerciseServiceImpl implements ExerciseService {
//
//    private final ExerciseRepository exerciseRepository;
//    private final WorkoutPlanRepository workoutPlanRepository;
//    private final WorkoutPlanItemRepository workoutPlanItemRepository;
//
//    public ExerciseServiceImpl(
//            ExerciseRepository exerciseRepository,
//            WorkoutPlanRepository workoutPlanRepository,
//            WorkoutPlanItemRepository workoutPlanItemRepository
//    ) {
//        this.exerciseRepository = exerciseRepository;
//        this.workoutPlanRepository = workoutPlanRepository;
//        this.workoutPlanItemRepository = workoutPlanItemRepository;
//    }
//
//    @Override
//    @Transactional
//    public ExerciseResponse addExercise(ExerciseRequest request) {
//        Exercise exercise = toEntity(request);
//        Exercise saved = exerciseRepository.save(exercise);
//
//        // ✅ Also attach to workout_plan for that user
//        WorkoutPlan plan = workoutPlanRepository
//                .findByMember_UserId(request.getUserId())
//                .orElseGet(() -> {
//                    WorkoutPlan newPlan = new WorkoutPlan();
//                    newPlan.setPlanName("Default Plan for User " + request.getUserId());
//                    User member = new User();
//                    member.setUserId(request.getUserId());
//                    newPlan.setMember(member);
//                    return workoutPlanRepository.save(newPlan);
//                });
//
//        WorkoutPlanItem item = new WorkoutPlanItem();
//        item.setWorkoutPlan(plan);
//        item.setExercise(saved);
//        workoutPlanItemRepository.save(item);
//
//        return toResponse(saved);
//    }
//
//    @Override
//    public List<ExerciseResponse> getAllExercises() {
//        return exerciseRepository.findAll()
//                .stream()
//                .map(this::toResponse)
//                .toList();
//    }
//
//    private Exercise toEntity(ExerciseRequest request) {
//        Exercise exercise = new Exercise();
//        exercise.setMuscleGroup(request.getMuscleGroup());
//        exercise.setExerciseName(request.getExerciseName());
//        exercise.setEquipment(request.getEquipment());
//        exercise.setWeight(request.getWeight());
//        exercise.setSets(request.getSets());
//        exercise.setReps(request.getReps());
//        exercise.setRestTime(request.getRestTime());
//        exercise.setDays(request.getDays());
//
//        if (request.getTrainerId() != null) {
//            User trainer = new User();
//            trainer.setUserId(request.getTrainerId());
//            exercise.setTrainer(trainer);
//        } else {
//            throw new EntityNotFoundException("Trainer is required");
//        }
//
//        if (request.getUserId() != null) {
//            User user = new User();
//            user.setUserId(request.getUserId());
//            exercise.setUser(user);
//        } else {
//            throw new EntityNotFoundException("User is required");
//        }
//
//        return exercise;
//    }
//
//    private ExerciseResponse toResponse(Exercise exercise) {
//        ExerciseResponse response = new ExerciseResponse();
//        response.setExerciseId(exercise.getExerciseId());
//        response.setMuscleGroup(exercise.getMuscleGroup());
//        response.setExerciseName(exercise.getExerciseName());
//        response.setEquipment(exercise.getEquipment());
//        response.setWeight(exercise.getWeight());
//        response.setSets(exercise.getSets());
//        response.setReps(exercise.getReps());
//        response.setRestTime(exercise.getRestTime());
//        response.setDays(exercise.getDays());
//
//        if (exercise.getTrainer() != null) {
//            response.setTrainerId(exercise.getTrainer().getUserId());
//        }
//        if (exercise.getUser() != null) {
//            response.setUserId(exercise.getUser().getUserId());
//        }
//
//        return response;
//    }
//}
