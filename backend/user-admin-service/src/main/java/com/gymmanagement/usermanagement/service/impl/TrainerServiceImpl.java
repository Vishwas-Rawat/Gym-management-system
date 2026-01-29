package com.gymmanagement.usermanagement.service.impl;

import com.gymmanagement.commonservices.entity.*;
import com.gymmanagement.commonservices.enumeration.RegistrationStatus;
import com.gymmanagement.commonservices.enumeration.Role;
import com.gymmanagement.usermanagement.Request.AddTrainerRequest;
import com.gymmanagement.usermanagement.Request.AssignMembersToTrainerRequest;
import com.gymmanagement.usermanagement.Request.CompleteTrainerRegistrationRequest;
import com.gymmanagement.usermanagement.Request.UpdateTrainerRequest;
import com.gymmanagement.usermanagement.Response.AddTrainerResponse; // ← Changed
import com.gymmanagement.usermanagement.Response.TrainerResponse;
import com.gymmanagement.usermanagement.repository.*;
import com.gymmanagement.usermanagement.service.EmailService;
import com.gymmanagement.usermanagement.service.TrainerService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TrainerServiceImpl implements TrainerService {

    private final UserRepository userRepository;
    private final TrainerRepository trainerRepository;
    private final GymRepository gymRepository;
    private final UserProfileRepository userProfileRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final MemberRepository memberRepository;

    private static final long TOKEN_VALIDITY_HOURS = 24;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public TrainerServiceImpl(UserRepository userRepository,
            TrainerRepository trainerRepository,
            GymRepository gymRepository,
            UserProfileRepository userProfileRepository,
            EmailService emailService,
            PasswordEncoder passwordEncoder, MemberRepository memberRepository) {
        this.userRepository = userRepository;
        this.trainerRepository = trainerRepository;
        this.gymRepository = gymRepository;
        this.userProfileRepository = userProfileRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.memberRepository = memberRepository;
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

        if (user != null) {
            // ✅ 1. Check if user is already a trainer in THIS gym
            Trainer existingTrainer = trainerRepository.findByUserAndGym(user, gym).orElse(null);

            if (existingTrainer != null) {
                // ✅ 1a. If PENDING, resend invite
                if (user.getRegistrationStatus() == RegistrationStatus.PENDING) {
                    resendTrainerRegistrationLink(user.getUserId());
                    return new AddTrainerResponse(existingTrainer, "Trainer is pending. Invitation re-sent.");
                }
                throw new IllegalArgumentException("User is already a trainer in this gym.");
            }

            // ✅ 1b. Check if user is already a MEMBER in this gym
            boolean isMemberInGym = memberRepository.findByUserAndGym(user, gym).isPresent();
            if (isMemberInGym) {
                throw new IllegalArgumentException("User is already registered as a member in this gym.");
            }
            // ✅ 2. User exists but NOT a trainer in this gym -> Proceed to add profile
        } else {
            // ✅ 3. Create NEW User
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
        }

        Trainer trainer = new Trainer();
        trainer.setUser(user);
        trainer.setGym(gym);
        trainer.setSpecialization(req.getSpecialization());
        trainer.setExperienceYears(req.getExperienceYears());
        trainer.setCreatedAt(LocalDateTime.now());
        trainer.setUpdatedAt(LocalDateTime.now());
        trainer.setDeleted(false);
        trainer.setIsActive(true);
        trainerRepository.save(trainer);

        String link = frontendUrl + "/trainer/register/complete?token=" + user.getRegistrationToken();
        emailService.sendRegistrationLink(user.getEmail(), link);

        return new AddTrainerResponse(trainer, "Trainer added successfully. Registration link sent.");
    }

    @Override
    public void resendTrainerRegistrationLink(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Trainer not found"));

        if (RegistrationStatus.REGISTERED.equals(user.getRegistrationStatus())) {
            throw new IllegalArgumentException("Trainer already registered");
        }

        user.setRegistrationToken(UUID.randomUUID().toString());
        user.setTokenGeneratedAt(LocalDateTime.now());
        userRepository.save(user);

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
    public void assignMembersToTrainer(AssignMembersToTrainerRequest request) {
        Trainer trainer = trainerRepository.findActiveById(request.getTrainerId())
                .orElseThrow(() -> new IllegalArgumentException("Trainer not found"));

        int count = 0;
        for (Integer memberId : request.getMemberIds()) {
            if (memberId == null) {
                throw new IllegalArgumentException(
                        "One of the selected Member IDs is NULL. Please check frontend selection.");
            }
            Member member = memberRepository.findActiveById(memberId)
                    .orElseThrow(() -> new IllegalArgumentException("Member not found: " + memberId));

            // Assign trainer to member (you need this field in Member entity)
            member.setTrainer(trainer);
            memberRepository.save(member);
            count++;
        }

        // Optional: Log or audit
        System.out
                .println(count + " members assigned to trainer: " + trainer.getUser().getUserProfile().getFirstName());
    }
}