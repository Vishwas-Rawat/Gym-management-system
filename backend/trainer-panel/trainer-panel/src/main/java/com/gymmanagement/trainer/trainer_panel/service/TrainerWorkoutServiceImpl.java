package com.gymmanagement.trainer.trainer_panel.service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.commonservices.entity.WorkoutPlan;
import com.gymmanagement.commonservices.entity.WorkoutPlanItem;
import com.gymmanagement.commonservices.enumeration.DayOfWeek;
import com.gymmanagement.commonservices.enumeration.ExerciseName;

import com.gymmanagement.trainer.trainer_panel.client.UserManagementClient;
import com.gymmanagement.trainer.trainer_panel.dto.AssignWorkoutRequest;
import com.gymmanagement.trainer.trainer_panel.dto.MemberDto;
import com.gymmanagement.trainer.trainer_panel.dto.ViewMemberResponse;
import com.gymmanagement.trainer.trainer_panel.dto.WorkoutAssignSuccessResponse;
import com.gymmanagement.trainer.trainer_panel.dto.WorkoutExerciseDto;
import com.gymmanagement.trainer.trainer_panel.dto.WorkoutItemResponse;
import com.gymmanagement.trainer.trainer_panel.dto.WorkoutPlanResponse;
import com.gymmanagement.trainer.trainer_panel.dto.UserResponse;
import com.gymmanagement.trainer.trainer_panel.dto.UserProfileResponse;

import com.gymmanagement.trainer.trainer_panel.repository.MemberRepository;
import com.gymmanagement.trainer.trainer_panel.repository.TrainerRepository;
import com.gymmanagement.trainer.trainer_panel.repository.WorkoutPlanItemRepository;
import com.gymmanagement.trainer.trainer_panel.repository.WorkoutPlanRepository;

@Service
@Transactional
public class TrainerWorkoutServiceImpl implements TrainerWorkoutService {

    private final UserManagementClient userClient;
    private final WorkoutPlanRepository planRepo;
    private final WorkoutPlanItemRepository itemRepo;
    private final MemberRepository memberRepo;
    private final TrainerRepository trainerRepo;

    public TrainerWorkoutServiceImpl(
            UserManagementClient userClient,
            WorkoutPlanRepository planRepo,
            WorkoutPlanItemRepository itemRepo,
            MemberRepository memberRepo,
            TrainerRepository trainerRepo) {
        this.userClient = userClient;
        this.planRepo = planRepo;
        this.itemRepo = itemRepo;
        this.memberRepo = memberRepo;
        this.trainerRepo = trainerRepo;
    }

    @Override
    public WorkoutAssignSuccessResponse assignWorkoutPlan(Integer trainerId, AssignWorkoutRequest req) {

        Member member = memberRepo.findById(req.getMemberId())
                .orElseThrow(() -> new IllegalArgumentException("No member found with memberId: " + req.getMemberId()));

        Integer memberUserId = member.getUser().getUserId();
        userClient.getUserById(memberUserId); // Validate user exists

        WorkoutPlan plan = planRepo.findFirstByMemberIdOrderByCreatedAtDesc(req.getMemberId())
                .orElse(null);

        if (plan == null) {
            plan = new WorkoutPlan();
            plan.setPlanName(req.getPlanName());
            plan.setMemberId(req.getMemberId());
            plan.setTrainerId(trainerId);
            plan.setCreatedAt(LocalDateTime.now());
            plan = planRepo.save(plan);
        } else {
            // Update Plan Details
            plan.setPlanName(req.getPlanName());
            plan.setTrainerId(trainerId);
            plan.setCreatedAt(LocalDateTime.now());

            // STRATEGY CHECK:
            String strategy = req.getStrategy(); // "REPLACE", "APPEND", or "REPLACE_DAYS"
            if ("REPLACE_DAYS".equalsIgnoreCase(strategy) && req.getExercises() != null) {
                // GRANULAR REPLACE: Only remove the days being assigned in this request
                Set<DayOfWeek> daysToReplace = req.getExercises().stream()
                        .filter(ex -> ex.getDays() != null)
                        .flatMap(ex -> ex.getDays().stream())
                        .map(String::toUpperCase)
                        .map(DayOfWeek::valueOf)
                        .collect(Collectors.toSet());

                List<WorkoutPlanItem> itemsToRemove = new java.util.ArrayList<>();
                for (WorkoutPlanItem item : plan.getItems()) {
                    item.getDays().removeAll(daysToReplace);
                    if (item.getDays().isEmpty()) {
                        itemsToRemove.add(item);
                    }
                }
                // Cleanup
                itemRepo.deleteAll(itemsToRemove);
                plan.getItems().removeAll(itemsToRemove);

            } else if (!"APPEND".equalsIgnoreCase(strategy)) {
                // Default behavior: REPLACE -> Wipe existing
                itemRepo.deleteAll(plan.getItems());
                plan.getItems().clear();
            }
        }

        if (req.getExercises() != null) {
            for (WorkoutExerciseDto ex : req.getExercises()) {

                WorkoutPlanItem item = new WorkoutPlanItem();
                item.setWorkoutPlan(plan);
                // item.setExerciseName(ExerciseName.valueOf(ex.getExerciseName()));
                item.setExerciseName(ex.getExerciseName()); // Allow ANY string (Custom Exercises)
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
                plan.getItems().add(item);
            }
        }

        planRepo.save(plan);

        WorkoutAssignSuccessResponse resp = new WorkoutAssignSuccessResponse();
        resp.setMessage("Workout plan saved successfully!");
        resp.setPlanId(plan.getPlanId());
        resp.setMemberId(req.getMemberId());
        resp.setTrainerId(trainerId);
        return resp;
    }

    @Override
    public WorkoutPlanResponse getLatestPlanForMember(Integer memberId) {

        WorkoutPlan plan = planRepo.findFirstByMemberIdOrderByCreatedAtDesc(memberId)
                .orElseThrow(() -> new IllegalArgumentException("No workout plan found for memberId " + memberId));

        Member member = memberRepo.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));

        UserResponse memberUser = userClient.getUserById(member.getUser().getUserId());

        return mapToResponse(plan, plan.getTrainerId(), memberUser);
    }

    private WorkoutPlanResponse mapToResponse(WorkoutPlan plan,
            Integer trainerId,
            UserResponse ignoredUserResponse) {

        WorkoutPlanResponse res = new WorkoutPlanResponse();
        res.setPlanId(plan.getPlanId());
        res.setPlanName(plan.getPlanName());
        res.setTrainerId(plan.getTrainerId());
        res.setMemberId(plan.getMemberId());
        res.setCreatedAt(plan.getCreatedAt());

        // ⭐ MEMBER NAME FROM PROFILE
        Integer memberUserId = memberRepo.findById(plan.getMemberId())
                .map(m -> m.getUser().getUserId())
                .orElse(null);

        if (memberUserId != null) {
            UserProfileResponse memberProfile = userClient.getUserProfile(memberUserId);
            res.setMemberName(memberProfile.getFirstName() + " " + safe(memberProfile.getLastName()));
        }

        // ⭐ TRAINER NAME FROM PROFILE
        Integer trainerUserId = trainerRepo.findById(trainerId)
                .map(t -> t.getUser().getUserId())
                .orElse(null);

        if (trainerUserId != null) {
            UserProfileResponse trainerProfile = userClient.getUserProfile(trainerUserId);
            res.setTrainerName(trainerProfile.getFirstName() + " " + safe(trainerProfile.getLastName()));
        }

        List<WorkoutItemResponse> items = plan.getItems()
                .stream()
                .map(item -> {
                    WorkoutItemResponse r = new WorkoutItemResponse();
                    r.setExerciseName(item.getExerciseName());

                    // Try to resolve display name from Enum, else use raw string
                    try {
                        com.gymmanagement.commonservices.enumeration.ExerciseName e = com.gymmanagement.commonservices.enumeration.ExerciseName
                                .valueOf(item.getExerciseName());
                        r.setDisplayName(e.getDisplayName());
                    } catch (IllegalArgumentException e) {
                        r.setDisplayName(item.getExerciseName());
                    }

                    r.setSets(item.getSets());
                    r.setReps(item.getReps());
                    r.setRestSeconds(item.getRestSeconds());
                    r.setNotes(item.getNotes());
                    r.setDays(item.getDays().stream().map(Enum::name).sorted().toList());
                    return r;
                }).toList();

        res.setExercises(items);
        return res;
    }

    private String safe(String s) {
        return s == null ? "" : s;
    }

    @Override
    public List<ViewMemberResponse> getAssignedMembers(Long gymId, Integer trainerId) {
        return userClient.getMembersByTrainer(gymId, trainerId);
    }

}
