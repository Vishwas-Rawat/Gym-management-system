package com.gymmanagement.exercise.exercise_management.service.impl;

import com.gymmanagement.commonservices.entity.WorkoutPlan;
import com.gymmanagement.commonservices.entity.WorkoutPlanItem;
import com.gymmanagement.commonservices.enumeration.DayOfWeek;
import com.gymmanagement.exercise.exercise_management.client.UserManagementClient;
import com.gymmanagement.exercise.exercise_management.dto.*;
import com.gymmanagement.exercise.exercise_management.repository.WorkoutPlanItemRepository;
import com.gymmanagement.exercise.exercise_management.repository.WorkoutPlanRepository;
import com.gymmanagement.exercise.exercise_management.service.TrainerWorkoutService;
import feign.FeignException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class TrainerWorkoutServiceImpl implements TrainerWorkoutService {

    private final UserManagementClient userManagementClient;
    private final WorkoutPlanRepository planRepo;
    private final WorkoutPlanItemRepository itemRepo;

    public TrainerWorkoutServiceImpl(
            UserManagementClient userManagementClient,
            WorkoutPlanRepository planRepo,
            WorkoutPlanItemRepository itemRepo) {
        this.userManagementClient = userManagementClient;
        this.planRepo = planRepo;
        this.itemRepo = itemRepo;
    }

    @Override
    public WorkoutPlanResponse assignWorkoutPlan(Integer trainerId, AssignWorkoutRequest req) {

        Integer userId = req.getUserId(); // <- use userId from DTO

        // 1) Try to get member record (preferred)
        UserManagementClient.MemberResponse memberResp = null;
        try {
            memberResp = userManagementClient.getActiveMemberById(userId);
        } catch (FeignException fe) {
            // If Feign throws (500) — fallback to fetching user by id
            // swallow and fallback below
        } catch (Exception ex) {
            // swallow and fallback
        }

        // 2) If memberResp is still null, try to get member-by-user endpoint or user by
        // id
        if (memberResp == null) {
            try {
                // try member by user id endpoint first (if implemented)
                try {
                    memberResp = userManagementClient.getMemberByUserId(userId);
                } catch (FeignException ignore) {
                    // ignore this and try /user/{id}
                }

                if (memberResp == null) {
                    UserManagementClient.UserResponse userResp = userManagementClient.getUserById(userId);

                    if (userResp == null) {
                        throw new IllegalArgumentException("Member/user not found");
                    }

                    UserManagementClient.MemberResponse synthetic = new UserManagementClient.MemberResponse();
                    synthetic.setMemberId(null); // no member row
                    synthetic.setTrainerId(null); // not assigned to any trainer
                    synthetic.setMembershipPlan(null);
                    synthetic.setUser(userResp);
                    memberResp = synthetic;
                }

            } catch (FeignException fe) {
                throw new IllegalArgumentException("Unable to fetch member/user: " + fe.getMessage());
            } catch (Exception e) {
                throw new IllegalArgumentException("Member or user not found");
            }
        }

        // 3) Validate trainer ownership only if member record contains trainerId
        if (memberResp.getTrainerId() != null && !Objects.equals(memberResp.getTrainerId(), trainerId)) {
            throw new IllegalArgumentException("Member is not assigned to you");
        }

        // 4) Get trainer full info
        UserManagementClient.UserResponse trainerResp;
        try {
            trainerResp = userManagementClient.getUserById(trainerId);
        } catch (FeignException fe) {
            throw new IllegalArgumentException("Trainer not found");
        }

        // 5) Create new workout plan
        WorkoutPlan plan = new WorkoutPlan();
        plan.setPlanName(req.getPlanName());
        // store the userId as memberId in workout plan (your DB uses memberId field)
        plan.setMemberId(userId);
        plan.setTrainerId(trainerId);
        plan.setCreatedAt(LocalDateTime.now());
        planRepo.save(plan);

        // 6) Add exercises
        if (req.getExercises() != null) {
            for (WorkoutExerciseDto ex : req.getExercises()) {
                WorkoutPlanItem item = new WorkoutPlanItem();
                item.setWorkoutPlan(plan);
                item.setExerciseName(ex.getExerciseName());
                item.setSets(ex.getSets());
                item.setReps(ex.getReps());
                item.setRestSeconds(ex.getRestSeconds());
                item.setNotes(ex.getNotes());

                Set<DayOfWeek> days = ex.getDays() == null ? Collections.emptySet()
                        : ex.getDays().stream()
                                .map(String::toUpperCase)
                                .map(DayOfWeek::valueOf)
                                .collect(Collectors.toSet());
                item.setDays(days);

                itemRepo.save(item);
            }
        }

        return mapToResponse(plan, trainerResp, memberResp.getUser());
    }

    @Override
    public List<MemberDto> getMembersByTrainer(Integer trainerId) {
        return userManagementClient.getMembersByTrainer(trainerId);
    }

    @Override
    public WorkoutPlanResponse getLatestPlanForMember(Integer memberId) {
        WorkoutPlan plan = planRepo.findFirstByMemberIdOrderByCreatedAtDesc(memberId)
                .orElseThrow(() -> new IllegalArgumentException("No workout plan found for this member"));

        UserManagementClient.MemberResponse memberResp = null;
        try {
            memberResp = userManagementClient.getActiveMemberById(memberId);
        } catch (FeignException fe) {
            // fallback to /user/{id}
        }

        if (memberResp == null) {
            UserManagementClient.UserResponse userResp = userManagementClient.getUserById(memberId);
            if (userResp == null)
                throw new IllegalArgumentException("Member/User not found");
            UserManagementClient.MemberResponse synthetic = new UserManagementClient.MemberResponse();
            synthetic.setMemberId(null);
            synthetic.setTrainerId(null);
            synthetic.setUser(userResp);
            memberResp = synthetic;
        }

        UserManagementClient.UserResponse trainerResp = userManagementClient.getUserById(plan.getTrainerId());
        return mapToResponse(plan, trainerResp, memberResp.getUser());
    }

    private WorkoutPlanResponse mapToResponse(WorkoutPlan plan,
            UserManagementClient.UserResponse trainer,
            UserManagementClient.UserResponse member) {

        WorkoutPlanResponse res = new WorkoutPlanResponse();
        res.setPlanId(plan.getPlanId());
        res.setPlanName(plan.getPlanName());
        res.setTrainerName(trainer != null
                ? (trainer.getFirstName() + " " + (trainer.getLastName() == null ? "" : trainer.getLastName())).trim()
                : "Trainer");
        res.setMemberName(member != null
                ? (member.getFirstName() + " " + (member.getLastName() == null ? "" : member.getLastName())).trim()
                : "Member");
        res.setCreatedAt(plan.getCreatedAt());

        List<WorkoutItemResponse> items = plan.getItems().stream().map(item -> {
            WorkoutItemResponse r = new WorkoutItemResponse();
            r.setExerciseName(item.getExerciseName());
            r.setDisplayName(item.getExerciseName());
            r.setSets(item.getSets());
            r.setReps(item.getReps());
            r.setRestSeconds(item.getRestSeconds());
            r.setNotes(item.getNotes());
            r.setDays(item.getDays().stream()
                    .map(Enum::name)
                    .sorted()
                    .toList());
            return r;
        }).toList();

        res.setExercises(items);
        return res;
    }
}
