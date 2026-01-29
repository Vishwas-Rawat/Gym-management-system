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
    private final com.gymmanagement.trainer.trainer_panel.repository.MemberRepository memberRepo;
    private final com.gymmanagement.trainer.trainer_panel.client.UserManagementClient userClient;

    @Override
    public RequestResponse createDietRequest(RequestCreateDto dto) {
        // Prevent Duplicate Pending
        boolean hasPending = dietRepo.findByMemberIdOrderByCreatedAtDesc(dto.getMemberId())
                .stream()
                .anyMatch(req -> req.getStatus() == null
                        || req.getStatus() == com.gymmanagement.commonservices.enumeration.RequestStatus.PENDING);

        if (hasPending) {
            throw new IllegalArgumentException("You already have a pending Diet Request.");
        }

        DietRequest r = new DietRequest();
        r.setMemberId(dto.getMemberId());
        r.setTrainerId(dto.getTrainerId());
        r.setNote(dto.getMessage());
        r.setCreatedAt(LocalDateTime.now());
        r.setStatus(com.gymmanagement.commonservices.enumeration.RequestStatus.PENDING);
        r = dietRepo.save(r);
        return toResponse(r);
    }

    @Override
    public RequestResponse createWorkoutRequest(RequestCreateDto dto) {
        // Prevent Duplicate Pending
        boolean hasPending = workoutRepo.findByMemberIdOrderByCreatedAtDesc(dto.getMemberId())
                .stream()
                .anyMatch(req -> req.getStatus() == null
                        || req.getStatus() == com.gymmanagement.commonservices.enumeration.RequestStatus.PENDING);

        if (hasPending) {
            throw new IllegalArgumentException("You already have a pending Workout Request.");
        }

        WorkoutRequest r = new WorkoutRequest();
        r.setMemberId(dto.getMemberId());
        r.setTrainerId(dto.getTrainerId());
        r.setNote(dto.getMessage());
        r.setCreatedAt(LocalDateTime.now());
        r.setStatus(com.gymmanagement.commonservices.enumeration.RequestStatus.PENDING);
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

    // NEW MTEHODS
    @Override
    public RequestResponse updateDietRequestStatus(Integer requestId,
            com.gymmanagement.commonservices.enumeration.RequestStatus status) {
        DietRequest r = dietRepo.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));
        r.setStatus(status);
        return toResponse(dietRepo.save(r));
    }

    @Override
    public RequestResponse updateWorkoutRequestStatus(Integer requestId,
            com.gymmanagement.commonservices.enumeration.RequestStatus status) {
        WorkoutRequest r = workoutRepo.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));
        r.setStatus(status);
        return toResponse(workoutRepo.save(r));
    }

    // MEMBER UPDITES IMPLEMENTATION

    @Override
    public RequestResponse updateDietRequest(Integer requestId, String message) {
        DietRequest r = dietRepo.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (r.getStatus() != com.gymmanagement.commonservices.enumeration.RequestStatus.PENDING) {
            throw new IllegalArgumentException(
                    "Cannot update request. It is already processed (" + r.getStatus() + ")");
        }

        r.setNote(message);
        return toResponse(dietRepo.save(r));
    }

    @Override
    public void deleteDietRequest(Integer requestId) {
        DietRequest r = dietRepo.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (r.getStatus() != com.gymmanagement.commonservices.enumeration.RequestStatus.PENDING) {
            throw new IllegalArgumentException(
                    "Cannot delete request. It is already processed (" + r.getStatus() + ")");
        }

        dietRepo.delete(r);
    }

    @Override
    public RequestResponse updateWorkoutRequest(Integer requestId, String message) {
        WorkoutRequest r = workoutRepo.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (r.getStatus() != com.gymmanagement.commonservices.enumeration.RequestStatus.PENDING) {
            throw new IllegalArgumentException(
                    "Cannot update request. It is already processed (" + r.getStatus() + ")");
        }

        r.setNote(message);
        return toResponse(workoutRepo.save(r));
    }

    @Override
    public void deleteWorkoutRequest(Integer requestId) {
        WorkoutRequest r = workoutRepo.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (r.getStatus() != com.gymmanagement.commonservices.enumeration.RequestStatus.PENDING) {
            throw new IllegalArgumentException(
                    "Cannot delete request. It is already processed (" + r.getStatus() + ")");
        }

        workoutRepo.delete(r);
    }

    private RequestResponse toResponse(DietRequest r) {
        RequestResponse res = new RequestResponse();
        res.setRequestId(r.getRequestId());
        res.setMemberId(r.getMemberId());
        res.setTrainerId(r.getTrainerId());
        res.setMessage(r.getNote());
        res.setCreatedAt(r.getCreatedAt());
        // Handle null status gracefully (for old records)
        res.setStatus(r.getStatus() != null ? r.getStatus().name() : "PENDING");
        res.setType("DIET");

        // Fetch member name
        memberRepo.findById(r.getMemberId()).ifPresent(m -> {
            try {
                var profile = userClient.getUserProfile(m.getUser().getUserId());
                if (profile != null) {
                    res.setMemberName(profile.getFirstName() + " " + profile.getLastName());
                }
            } catch (Exception e) {
                res.setMemberName("Member " + r.getMemberId());
            }
        });

        return res;
    }

    private RequestResponse toResponse(WorkoutRequest r) {
        RequestResponse res = new RequestResponse();
        res.setRequestId(r.getRequestId());
        res.setMemberId(r.getMemberId());
        res.setTrainerId(r.getTrainerId());
        res.setMessage(r.getNote());
        res.setCreatedAt(r.getCreatedAt());
        // Handle null status gracefully (for old records)
        res.setStatus(r.getStatus() != null ? r.getStatus().name() : "PENDING");
        res.setType("WORKOUT");

        // Fetch member name
        memberRepo.findById(r.getMemberId()).ifPresent(m -> {
            try {
                var profile = userClient.getUserProfile(m.getUser().getUserId());
                if (profile != null) {
                    res.setMemberName(profile.getFirstName() + " " + profile.getLastName());
                }
            } catch (Exception e) {
                res.setMemberName("Member " + r.getMemberId());
            }
        });

        return res;
    }
}
