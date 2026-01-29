// src/main/java/com/gymmanagement/usermanagement/service/TrainerService.java
package com.gymmanagement.usermanagement.service;

import com.gymmanagement.commonservices.entity.Trainer;
import com.gymmanagement.usermanagement.Request.AddTrainerRequest;
import com.gymmanagement.usermanagement.Request.AssignMembersToTrainerRequest;
import com.gymmanagement.usermanagement.Request.CompleteTrainerRegistrationRequest;
import com.gymmanagement.usermanagement.Request.UpdateTrainerRequest;
import com.gymmanagement.usermanagement.Response.AddTrainerResponse;
import com.gymmanagement.usermanagement.Response.TrainerResponse;

import java.util.List;

public interface TrainerService {
    List<AddTrainerResponse> addTrainersByAdmin(List<AddTrainerRequest> requests); // ← Fixed return type

    void resendTrainerRegistrationLink(Integer userId);

    void completeTrainerRegistration(CompleteTrainerRegistrationRequest request);

    Trainer updateTrainer(Integer trainerId, UpdateTrainerRequest request);

    void deleteTrainer(Integer trainerId);

    List<Trainer> getAllActiveTrainers();

    Trainer getTrainerById(Integer trainerId);

    List<TrainerResponse> searchTrainers(String keyword);

    List<TrainerResponse> searchTrainersByAdminId(String keyword, Integer adminId);

    List<TrainerResponse> getTrainersByGymId(Long gymId);

    List<TrainerResponse> getTrainersByAdminId(Integer adminId);

    void assignMembersToTrainer(AssignMembersToTrainerRequest request);
}