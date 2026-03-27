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
    List<AddTrainerResponse> addTrainersByAdmin(List<AddTrainerRequest> requests);

    void resendTrainerRegistrationLink(Integer trainerId);

    void completeTrainerRegistration(CompleteTrainerRegistrationRequest request);

    Trainer updateTrainer(Integer trainerId, UpdateTrainerRequest request);

    void deleteTrainer(Integer trainerId);

    List<Trainer> getAllActiveTrainers();

    Trainer getTrainerById(Integer trainerId);

    List<TrainerResponse> searchTrainers(String keyword);

    List<TrainerResponse> getTrainersByGymId(Long gymId);

    void assignMembersToTrainer(AssignMembersToTrainerRequest request);

    List<com.gymmanagement.usermanagement.Response.GymMemberResponse> getMembersUnderTrainer(Integer trainerId);

    List<com.gymmanagement.usermanagement.Response.GymMemberResponse> getPotentialMembersForTrainer(Integer trainerId);
    
    void removeMemberFromTrainer(Integer trainerId, Integer memberId);
}