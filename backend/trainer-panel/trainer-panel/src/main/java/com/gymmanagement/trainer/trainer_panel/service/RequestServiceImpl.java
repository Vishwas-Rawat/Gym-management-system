package com.gymmanagement.trainer.trainer_panel.service;

import com.gymmanagement.commonservices.entity.DietRequest;
import com.gymmanagement.commonservices.entity.WorkoutRequest;
import com.gymmanagement.trainer.trainer_panel.dto.RequestCreateDto;
import com.gymmanagement.trainer.trainer_panel.dto.RequestResponse;
import com.gymmanagement.trainer.trainer_panel.repository.DietRequestRepository;
import com.gymmanagement.trainer.trainer_panel.repository.WorkoutRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class RequestServiceImpl implements RequestService {

    private final DietRequestRepository dietRepo;
    private final WorkoutRequestRepository workoutRepo;

    @Override
    public RequestResponse createDietRequest(RequestCreateDto dto) {
        DietRequest r = new DietRequest();
        r.setMemberId(dto.getMemberId());
        r.setTrainerId(dto.getTrainerId());
        r.setNote(dto.getMessage());
        r.setCreatedAt(LocalDateTime.now());
        r = dietRepo.save(r);
        return toResponse(r);
    }

    @Override
    public RequestResponse createWorkoutRequest(RequestCreateDto dto) {
        WorkoutRequest r = new WorkoutRequest();
        r.setMemberId(dto.getMemberId());
        r.setTrainerId(dto.getTrainerId());
        r.setNote(dto.getMessage());
        r.setCreatedAt(LocalDateTime.now());
        r = workoutRepo.save(r);
        return toResponse(r);
    }

    @Override
    public List<RequestResponse> getDietRequestsForTrainer(Integer trainerId) {
        return dietRepo.findByTrainerIdOrderByCreatedAtDesc(trainerId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<RequestResponse> getWorkoutRequestsForTrainer(Integer trainerId) {
        return workoutRepo.findByTrainerIdOrderByCreatedAtDesc(trainerId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<RequestResponse> getDietRequestsForMember(Integer memberId) {
        return dietRepo.findByMemberIdOrderByCreatedAtDesc(memberId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public List<RequestResponse> getWorkoutRequestsForMember(Integer memberId) {
        return workoutRepo.findByMemberIdOrderByCreatedAtDesc(memberId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private RequestResponse toResponse(DietRequest r) {
        RequestResponse res = new RequestResponse();
        res.setRequestId(r.getRequestId());
        res.setMemberId(r.getMemberId());
        res.setTrainerId(r.getTrainerId());
        res.setMessage(r.getNote());
        res.setCreatedAt(r.getCreatedAt());
        return res;
    }

    private RequestResponse toResponse(WorkoutRequest r) {
        RequestResponse res = new RequestResponse();
        res.setRequestId(r.getRequestId());
        res.setMemberId(r.getMemberId());
        res.setTrainerId(r.getTrainerId());
        res.setMessage(r.getNote());
        res.setCreatedAt(r.getCreatedAt());
        return res;
    }
}
