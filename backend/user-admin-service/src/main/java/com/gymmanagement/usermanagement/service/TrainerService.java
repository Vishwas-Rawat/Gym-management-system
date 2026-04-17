// src/main/java/com/gymmanagement/usermanagement/service/TrainerService.java
package com.gymmanagement.usermanagement.service;

import java.util.List;

import com.gymmanagement.commonservices.entity.Trainer;
import com.gymmanagement.usermanagement.Request.AddTrainerRequest;
import com.gymmanagement.usermanagement.Request.AssignMembersToTrainerRequest;
import com.gymmanagement.usermanagement.Request.CompleteTrainerRegistrationRequest;
import com.gymmanagement.usermanagement.Request.TrainerProfileUpdateRequest;
import com.gymmanagement.usermanagement.Request.UpdateTrainerRequest;
import com.gymmanagement.usermanagement.Response.AddTrainerResponse;
import com.gymmanagement.usermanagement.Response.MemberAssignmentResponse;
import com.gymmanagement.usermanagement.Response.TrainerProfileResponse;
import com.gymmanagement.usermanagement.Response.TrainerResponse;

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

    MemberAssignmentResponse assignMembersToTrainer(AssignMembersToTrainerRequest request);

    List<com.gymmanagement.usermanagement.Response.GymMemberResponse> getPotentialMembers(Integer trainerId);

    TrainerProfileResponse getTrainerProfileByUserId(Integer userId);

    TrainerProfileResponse updateTrainerProfile(Integer userId, TrainerProfileUpdateRequest request);
}