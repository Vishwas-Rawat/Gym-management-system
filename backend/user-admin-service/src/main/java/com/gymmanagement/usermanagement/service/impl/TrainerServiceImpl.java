package com.gymmanagement.usermanagement.service.impl;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gymmanagement.commonservices.entity.Gym;
import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.commonservices.entity.Trainer;
import com.gymmanagement.commonservices.entity.User;
import com.gymmanagement.commonservices.entity.UserProfile;
import com.gymmanagement.commonservices.enumeration.RegistrationStatus;
import com.gymmanagement.commonservices.enumeration.Role;
import com.gymmanagement.usermanagement.Request.AddTrainerRequest;
import com.gymmanagement.usermanagement.Request.AssignMembersToTrainerRequest;
import com.gymmanagement.usermanagement.Request.CompleteTrainerRegistrationRequest;
import com.gymmanagement.usermanagement.Request.TrainerProfileUpdateRequest;
import com.gymmanagement.usermanagement.Request.UpdateTrainerRequest;
import com.gymmanagement.usermanagement.Response.AddTrainerResponse; // ← Changed
import com.gymmanagement.usermanagement.Response.MemberAssignmentResponse;
import com.gymmanagement.usermanagement.Response.TrainerProfileResponse;
import com.gymmanagement.usermanagement.Response.TrainerResponse;
import com.gymmanagement.usermanagement.repository.GymRepository;
import com.gymmanagement.usermanagement.repository.MemberRepository;
import com.gymmanagement.usermanagement.repository.TrainerRepository;
import com.gymmanagement.usermanagement.repository.UserProfileRepository;
import com.gymmanagement.usermanagement.repository.UserRepository;
import com.gymmanagement.usermanagement.service.EmailService;
import com.gymmanagement.usermanagement.service.TrainerService;

@Service
public class TrainerServiceImpl implements TrainerService {

    private final UserRepository userRepository;
    private final TrainerRepository trainerRepository;
    private final GymRepository gymRepository;
    private final UserProfileRepository userProfileRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final MemberRepository memberRepository;
    private final com.gymmanagement.usermanagement.service.AuditLogService auditLogService;

    private static final long TOKEN_VALIDITY_HOURS = 24;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public TrainerServiceImpl(UserRepository userRepository,
            TrainerRepository trainerRepository,
            GymRepository gymRepository,
            UserProfileRepository userProfileRepository,
            EmailService emailService,
            PasswordEncoder passwordEncoder, MemberRepository memberRepository,
            com.gymmanagement.usermanagement.service.AuditLogService auditLogService) {
        this.userRepository = userRepository;
        this.trainerRepository = trainerRepository;
        this.gymRepository = gymRepository;
        this.userProfileRepository = userProfileRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.memberRepository = memberRepository;
        this.auditLogService = auditLogService;
    }

    // FIXED: Return AddTrainerResponse
    @Override
    @Transactional
    public List<AddTrainerResponse> addTrainersByAdmin(List<AddTrainerRequest> requests) {
        return requests.stream()
                .map(this::addSingleTrainer)
                .toList();
    }

    private AddTrainerResponse addSingleTrainer(AddTrainerRequest req) {
        Gym gym = gymRepository.findById(req.getGymId().longValue())
                .orElseThrow(() -> new IllegalArgumentException("Gym not found"));

        User user = userRepository.findByEmail(req.getEmail()).orElse(null);
        Trainer trainer = null;

        if (user != null) {
            // ✅ 1. Check if user is already a trainer in THIS gym
            trainer = trainerRepository.findByUserAndGym(user, gym).orElse(null);

            if (trainer != null) {
                // ✅ 1a. If isActive, handle as duplicate
                if (Boolean.TRUE.equals(trainer.getIsActive())) {
                    if (user.getRegistrationStatus() == RegistrationStatus.PENDING) {
                        resendTrainerRegistrationLink(user.getUserId());
                        return new AddTrainerResponse(trainer, "Trainer is pending. Invitation re-sent.");
                    }
                    throw new IllegalArgumentException("User is already a trainer in this gym.");
                }
                // ✅ 1b. If NOT active (soft-deleted), we will REACTIVATE below
                // NEW: Force re-registration email with fresh token
                user.setRegistrationStatus(RegistrationStatus.PENDING);
                user.setRegistrationToken(UUID.randomUUID().toString());
                user.setTokenGeneratedAt(LocalDateTime.now());
                userRepository.save(user);
            } else {
                // ✅ 1c. Check if user is already an ACTIVE MEMBER in this gym
                boolean isMemberInGym = memberRepository.findByUserAndGym(user, gym)
                        .map(m -> Boolean.TRUE.equals(m.getIsActive()))
                        .orElse(false);
                if (isMemberInGym) {
                    throw new IllegalArgumentException("User is already an ACTIVE member in this gym. Cannot add as trainer.");
                }
                // ✅ 1d. Create NEW Trainer record for this user in this gym
                
                // NEW: Force PENDING status and new token even for existing users
                user.setRegistrationStatus(RegistrationStatus.PENDING);
                user.setRegistrationToken(UUID.randomUUID().toString());
                user.setTokenGeneratedAt(LocalDateTime.now());
                userRepository.save(user);

                trainer = new Trainer();
                trainer.setUser(user);
                trainer.setGym(gym);
            }
        } else {
            // ✅ 2. Create NEW User and Profile
            user = new User();
            user.setEmail(req.getEmail());
            user.setPhoneNumber(req.getPhoneNo());
            user.setRole(Role.TRAINER);
            user.setRegistrationStatus(RegistrationStatus.PENDING);
            user.setRegistrationToken(UUID.randomUUID().toString());
            user.setTokenGeneratedAt(LocalDateTime.now());
            user.setIsActive(false);
            user.setIsEmailVerified(false);
            userRepository.save(user);

            String[] nameParts = req.getFullName().trim().split("\\s+", 2);
            UserProfile profile = new UserProfile();
            profile.setUser(user);
            profile.setFirstName(nameParts[0]);
            profile.setLastName(nameParts.length > 1 ? nameParts[1] : "");
            user.setUserProfile(profile);
            userProfileRepository.save(profile);

            // Create NEW Trainer record
            trainer = new Trainer();
            trainer.setUser(user);
            trainer.setGym(gym);
        }

        // --- MANAGE TRAINER STATE (NEW or REACTIVATED) ---
        trainer.setSpecialization(req.getSpecialization());
        trainer.setExperienceYears(req.getExperienceYears());
        trainer.setSalary(req.getSalary());
        trainer.setEmail(req.getEmail());
        trainer.setPhoneNo(req.getPhoneNo());
        trainer.setFullName(req.getFullName());
        trainer.setStatus("ACTIVE");
        trainer.setCreatedAt(trainer.getCreatedAt() == null ? LocalDateTime.now() : trainer.getCreatedAt());
        trainer.setUpdatedAt(LocalDateTime.now());
        trainer.setDeleted(false);
        trainer.setIsActive(true);
        trainer.setDeletedAt(null);
        trainerRepository.save(trainer);

        // Only send registration email if user is still PENDING
        if (RegistrationStatus.PENDING.equals(user.getRegistrationStatus())) {
            String link = frontendUrl + "/trainer/register/complete?token=" + user.getRegistrationToken();
            emailService.sendRegistrationLink(user.getEmail(), link);

            // ⭐ AUDIT LOG
            auditLogService.logAction("ADD", "TRAINER", trainer.getTrainerId().toString(), 
                "Added trainer: " + user.getEmail() + " (Welcome Email Sent)");

            return new AddTrainerResponse(trainer, "Trainer added successfully. Registration email sent.");
        }

        // ⭐ AUDIT LOG
        auditLogService.logAction("ADD", "TRAINER", trainer.getTrainerId().toString(), 
            "Re-added existing trainer: " + user.getEmail());

        return new AddTrainerResponse(trainer, "Trainer re-added successfully. User is already registered.");
    }

    @Override
    public void resendTrainerRegistrationLink(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Trainer not found"));

        if (RegistrationStatus.REGISTERED.equals(user.getRegistrationStatus())) {
            throw new IllegalArgumentException("Trainer already registered");
        }

        ensureValidRegistrationToken(user);
 
        String link = frontendUrl + "/trainer/register/complete?token=" + user.getRegistrationToken();
        emailService.sendRegistrationLink(user.getEmail(), link);
    }

    @Override
    @Transactional
    public void completeTrainerRegistration(CompleteTrainerRegistrationRequest request) {
        User user = userRepository.findByRegistrationToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired token"));

        if (Duration.between(user.getTokenGeneratedAt(), LocalDateTime.now()).toHours() > TOKEN_VALIDITY_HOURS) {
            throw new IllegalArgumentException("Link expired");
        }

        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        String username = request.getUsername().trim();
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already taken");
        }
        user.setUsername(username);

        user.setRegistrationStatus(RegistrationStatus.REGISTERED);
        user.setIsActive(true);
        user.setIsEmailVerified(true);
        user.setRegistrationToken(null);
        user.setTokenGeneratedAt(null);
        userRepository.save(user);

        UserProfile profile = user.getUserProfile();
        if (profile == null) {
            profile = new UserProfile();
            profile.setUser(user);
            user.setUserProfile(profile);
        }
        if (request.getDateOfBirth() != null)
            profile.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null)
            profile.setGender(request.getGender());
        userProfileRepository.save(profile);

        // Update ALL trainer profiles for this user (in case they belong to multiple
        // gyms)
        trainerRepository.findByUser(user).forEach(t -> {
            t.setUpdatedAt(LocalDateTime.now());
            trainerRepository.save(t);
        });
    }

    // Add these methods to your TrainerServiceImpl

    @Override
    @Transactional
    public Trainer updateTrainer(Integer trainerId, UpdateTrainerRequest request) {
        Trainer trainer = trainerRepository.findActiveById(trainerId)
                .orElseThrow(() -> new IllegalArgumentException("Trainer not found or deleted"));

        if (request.getSpecialization() != null)
            trainer.setSpecialization(request.getSpecialization());
        if (request.getExperienceYears() != null)
            trainer.setExperienceYears(request.getExperienceYears());
        if (request.getAvailability() != null)
            trainer.setAvailability(request.getAvailability());
        if (request.getPhoneNo() != null)
            trainer.setPhoneNo(request.getPhoneNo());
        if (request.getSalary() != null)
            trainer.setSalary(request.getSalary());
        if (request.getStatus() != null)
            trainer.setStatus(request.getStatus());

        trainer.setUpdatedAt(LocalDateTime.now());
        return trainerRepository.save(trainer);
    }

    @Override
    @Transactional
    public void deleteTrainer(Integer trainerId) {
        Trainer trainer = trainerRepository.findById(trainerId)
                .orElseThrow(() -> new IllegalArgumentException("Trainer not found"));

        if (Boolean.FALSE.equals(trainer.getIsActive()) || Boolean.TRUE.equals(trainer.getDeleted())) {
            throw new IllegalArgumentException("Trainer already deleted");
        }

        trainer.setIsActive(false);
        trainer.setDeleted(true);
        trainer.setDeletedAt(LocalDateTime.now());
        trainer.setUpdatedAt(LocalDateTime.now());
        trainerRepository.save(trainer);

        // ⭐ AUDIT LOG
        auditLogService.logAction("DELETE", "TRAINER", trainerId.toString(), 
            "Soft-deleted trainer ID: " + trainerId);
    }

    @Override
    public List<Trainer> getAllActiveTrainers() {
        return trainerRepository.findAllActive();
    }

    @Override
    public Trainer getTrainerById(Integer trainerId) {
        return trainerRepository.findActiveById(trainerId)
                .orElseThrow(() -> new IllegalArgumentException("Trainer not found"));
    }

    @Override
    public List<TrainerResponse> searchTrainers(String keyword) {
        return trainerRepository.searchActiveTrainers(keyword).stream()
                .map(TrainerResponse::new)
                .toList();
    }

    @Override
    public List<TrainerResponse> searchTrainersByAdminId(String keyword, Integer adminId) {
        return trainerRepository.searchActiveTrainersByAdminId(keyword, adminId).stream()
                .map(TrainerResponse::new)
                .toList();
    }

    @Override
    public List<TrainerResponse> getTrainersByGymId(Long gymId) {
        return trainerRepository.findActiveTrainersByGymId(gymId).stream()
                .map(TrainerResponse::new)
                .toList();
    }

    @Override
    public List<TrainerResponse> getTrainersByAdminId(Integer adminId) {
        return trainerRepository.findActiveTrainersByAdminId(adminId).stream()
                .map(TrainerResponse::new)
                .toList();
    }

    // In TrainerServiceImpl
    @Override
    @Transactional
    public MemberAssignmentResponse assignMembersToTrainer(AssignMembersToTrainerRequest request) {
        Trainer trainer = trainerRepository.findActiveById(request.getTrainerId())
                .orElseThrow(() -> new IllegalArgumentException("Trainer not found"));

        String trainerName = trainer.getUser().getUserProfile() != null
                ? trainer.getUser().getUserProfile().getFirstName() + " " +
                        (trainer.getUser().getUserProfile().getLastName() != null
                                ? trainer.getUser().getUserProfile().getLastName()
                                : "")
                : "Trainer";

        List<String> assignedMemberNames = new ArrayList<>();

        for (Integer memberId : request.getMemberIds()) {
            if (memberId == null) {
                throw new IllegalArgumentException(
                        "One of the selected Member IDs is NULL. Please check frontend selection.");
            }
            Member member = memberRepository.findActiveById(memberId)
                    .orElseThrow(() -> new IllegalArgumentException("Member not found: " + memberId));

            member.setTrainer(trainer);
            memberRepository.save(member);

            String memberName = member.getUser().getUserProfile() != null
                    ? member.getUser().getUserProfile().getFirstName() + " " +
                            (member.getUser().getUserProfile().getLastName() != null
                                    ? member.getUser().getUserProfile().getLastName()
                                    : "")
                    : "Member " + memberId;

            assignedMemberNames.add(memberName);
        }

        return MemberAssignmentResponse.builder()
                .success(true)
                .message(assignedMemberNames.size() + " members assigned to trainer " + trainerName)
                .trainerName(trainerName)
                .assignedMemberNames(assignedMemberNames)
                .build();
    }

    @Override
    public List<com.gymmanagement.usermanagement.Response.GymMemberResponse> getPotentialMembers(Integer trainerId) {
        Trainer trainer = trainerRepository.findActiveById(trainerId)
                .orElseThrow(() -> new IllegalArgumentException("Trainer not found"));

        List<Member> members = memberRepository.findActiveMembersByGymId(trainer.getGym().getGymId());

        return members.stream()
                .map(com.gymmanagement.usermanagement.Response.GymMemberResponse::new)
                .toList();
    }

    /**
     * Reuses the existing token if it's still valid (< 24h),
     * otherwise generates a fresh one.
     */
    private void ensureValidRegistrationToken(User user) {
        boolean hasValidToken = user.getRegistrationToken() != null &&
                user.getTokenGeneratedAt() != null &&
                Duration.between(user.getTokenGeneratedAt(), LocalDateTime.now()).toHours() < TOKEN_VALIDITY_HOURS;

        if (!hasValidToken) {
            user.setRegistrationToken(UUID.randomUUID().toString());
            user.setTokenGeneratedAt(LocalDateTime.now());
            userRepository.save(user);
        }
    }

    @Override
    public TrainerProfileResponse getTrainerProfileByUserId(Integer userId) {
        Trainer trainer = trainerRepository.findByUser_UserId(userId).stream()
                .filter(t -> Boolean.TRUE.equals(t.getIsActive()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Trainer profile not found for user ID: " + userId));
        
        return new TrainerProfileResponse(trainer);
    }

    @Override
    @Transactional
    public TrainerProfileResponse updateTrainerProfile(Integer userId, TrainerProfileUpdateRequest request) {
        Trainer trainer = trainerRepository.findByUser_UserId(userId).stream()
                .filter(t -> Boolean.TRUE.equals(t.getIsActive()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Trainer not found for update"));

        // 1. Update Trainer-specific Info
        if (request.getSpecialization() != null) trainer.setSpecialization(request.getSpecialization());
        if (request.getExperienceYears() != null) trainer.setExperienceYears(request.getExperienceYears());
        if (request.getAvailability() != null) trainer.setAvailability(request.getAvailability());
        if (request.getPhoneNo() != null) trainer.setPhoneNo(request.getPhoneNo());

        // 2. Update User Profile Info
        User user = trainer.getUser();
        if (user != null) {
            if (request.getPhoneNo() != null) user.setPhoneNumber(request.getPhoneNo()); // Sync phone
            
            UserProfile profile = user.getUserProfile();
            if (profile == null) {
                profile = new UserProfile();
                profile.setUser(user);
                user.setUserProfile(profile);
            }
            if (request.getFirstName() != null) profile.setFirstName(request.getFirstName());
            if (request.getLastName() != null) profile.setLastName(request.getLastName());
            if (request.getGender() != null) profile.setGender(request.getGender());
            if (request.getDateOfBirth() != null) profile.setDateOfBirth(request.getDateOfBirth());
            
            userProfileRepository.save(profile);
            userRepository.save(user);

            // Update fullName in Trainer record for legacy compatibility
            String newFullName = (profile.getFirstName() + " " + (profile.getLastName() != null ? profile.getLastName() : "")).trim();
            trainer.setFullName(newFullName);
        }

        trainer.setUpdatedAt(LocalDateTime.now());
        Trainer savedTrainer = trainerRepository.save(trainer);
        
        return new TrainerProfileResponse(savedTrainer);
    }
}
