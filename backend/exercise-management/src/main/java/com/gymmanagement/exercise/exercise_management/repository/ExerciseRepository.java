package com.gymmanagement.exercise.exercise_management.repository;

import com.gymmanagement.commonservices.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Integer> {
}
