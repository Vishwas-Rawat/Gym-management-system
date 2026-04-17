package com.gymmanagement.trainer.trainer_panel.service;

import com.gymmanagement.trainer.trainer_panel.dto.RequestCreateDto;
import com.gymmanagement.trainer.trainer_panel.dto.RequestResponse;

import java.util.List;

public interface RequestService {

        RequestResponse createDietRequest(RequestCreateDto dto);

        RequestResponse createWorkoutRequest(RequestCreateDto dto);

        List<RequestResponse> getDietRequestsForTrainer(Integer trainerId);

        List<RequestResponse> getWorkoutRequestsForTrainer(Integer trainerId);

        List<RequestResponse> getDietRequestsForMember(Integer memberId);

        List<RequestResponse> getWorkoutRequestsForMember(Integer memberId);

        RequestResponse updateDietRequestStatus(Integer requestId,
                        com.gymmanagement.commonservices.enumeration.RequestStatus status);

        RequestResponse updateWorkoutRequestStatus(Integer requestId,
                        com.gymmanagement.commonservices.enumeration.RequestStatus status);

        // Member Updates
        RequestResponse updateDietRequest(Integer requestId, String message);

        void deleteDietRequest(Integer requestId);

        RequestResponse updateWorkoutRequest(Integer requestId, String message);

        void deleteWorkoutRequest(Integer requestId);
}
