package com.gymmanagement.usermanagement.service.impl;

import com.gymmanagement.commonservices.entity.*;
import com.gymmanagement.commonservices.enumeration.RegistrationStatus;
import com.gymmanagement.commonservices.enumeration.Role;
import com.gymmanagement.usermanagement.Request.AdminAddMemberRequest;
import com.gymmanagement.usermanagement.Request.CompleteRegistrationRequest;
import com.gymmanagement.usermanagement.Request.UpdateMemberRequest;
import com.gymmanagement.usermanagement.Response.AddMemberResponse;
import com.gymmanagement.usermanagement.Response.MemberWithExpiryResponse;
import com.gymmanagement.usermanagement.repository.*;
import com.gymmanagement.usermanagement.service.EmailService;
import com.gymmanagement.usermanagement.service.MemberService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final GymRepository gymRepository;
    private final UserVerificationRepository userVerificationRepository;
    private final UserProfileRepository userProfileRepository;
    private final TrainerRepository trainerRepository;

    private static final long TOKEN_VALIDITY_HOURS = 24;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public MemberServiceImpl(MemberRepository memberRepository,
            UserRepository userRepository,
            EmailService emailService,
            GymRepository gymRepository,
            PasswordEncoder passwordEncoder,
            UserVerificationRepository userVerificationRepository,
            UserProfileRepository userProfileRepository,
            TrainerRepository trainerRepository) {
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.gymRepository = gymRepository;
        this.userVerificationRepository = userVerificationRepository;
        this.userProfileRepository = userProfileRepository;
        this.trainerRepository = trainerRepository;
    }

    /* --------------------------------------------------------------------- */
    /* 1. ADD MULTIPLE MEMBERS ADD (ADMIN) */
    /* --------------------------------------------------------------------- */
    @Override
    @Transactional
    public List<AddMemberResponse> addMultipleMembersByAdmin(List<AdminAddMemberRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            throw new IllegalArgumentException("No members provided for addition");
        }
        return requests.stream()
                .map(this::addSingleMember)
                .toList();
    }

    private AddMemberResponse addSingleMember(AdminAddMemberRequest req) {
        String[] nameParts = req.getFullName().trim().split("\\s+", 2);
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        Gym gym = gymRepository.findById(req.getGymId().longValue())
                .orElseThrow(() -> new IllegalArgumentException("Gym not found: " + req.getGymId()));

        User user = userRepository.findByEmail(req.getEmail()).orElse(null);

        if (user != null) {
            // ✅ 1. Check if user is already in THIS gym
            Member existingMember = memberRepository.findByUserAndGym(user, gym).orElse(null);

            if (existingMember != null) {
                // ✅ 1a. If PENDING, resend invite
                if (user.getRegistrationStatus() == RegistrationStatus.PENDING) {
                    resendRegistrationLink(user.getUserId());
                    return new AddMemberResponse(existingMember, "User is pending. Invitation re-sent.");
                }
                throw new IllegalArgumentException("User is already a member of this gym.");
            }

            // ✅ 1b. Check if user is already a TRAINER in this gym
            boolean isTrainerInGym = trainerRepository.findByUserAndGym(user, gym).isPresent();
            if (isTrainerInGym) {
                throw new IllegalArgumentException("User is already registered as a trainer in this gym.");
            }

            // ✅ 2. User exists but NOT in this gym -> Allow adding new membership
            // No need to create new User, just use existing one.
        } else {
            // ✅ 3. Create NEW User
            user = new User();
            user.setEmail(req.getEmail());
            user.setPhoneNumber(req.getPhoneNo());
            user.setRole(Role.MEMBER);
            user.setRegistrationStatus(RegistrationStatus.PENDING);
            user.setRegistrationToken(UUID.randomUUID().toString());
            user.setTokenGeneratedAt(LocalDateTime.now());
            user.setIsActive(false);
            user.setIsEmailVerified(false);
            userRepository.save(user);

            UserProfile profile = new UserProfile();
            profile.setUser(user);
            profile.setFirstName(firstName);
            profile.setLastName(lastName);
            user.setUserProfile(profile);
            userProfileRepository.save(profile);
        }

        Member member = new Member();
        member.setUser(user);
        member.setGym(gym);
        member.setMonthsPaid(req.getMonthsPaid());
        member.setMonthsFree(req.getMonthsFree() != null ? req.getMonthsFree() : 0);

        member.setWorkoutTimeSlot(req.getWorkoutTimeSlot());

        member.setRegistrationFee(req.getRegistrationFee() != null ? req.getRegistrationFee() : 0.0);
        member.setPlanPrice(req.getPlanPrice() != null ? req.getPlanPrice() : 0.0);
        member.setDiscount(req.getDiscount() != null ? req.getDiscount() : 0.0);

        double total = member.getRegistrationFee() + member.getPlanPrice() - member.getDiscount();
        member.setTotalAmount(Math.max(0, total));
        member.setPaymentMethod(req.getPaymentMethod());
        member.setJoiningDate(req.getJoiningDate());

        // Set plan_start_date = joining_date for new members
        member.setPlanStartDate(req.getJoiningDate());

        member.setMembershipPlan(member.getMonthsPaid() + " months" +
                (member.getMonthsFree() > 0 ? " + " + member.getMonthsFree() + " free" : ""));
        member.setAmountPaid(member.getTotalAmount());
        member.setIsActive(true);
        member.setDeletedAt(null);

        memberRepository.save(member);

        String link = buildRegistrationLink(user.getRegistrationToken());
        emailService.sendRegistrationLink(user.getEmail(), link);

        return new AddMemberResponse(member, "Member added successfully. Registration link sent.");
    }

    /* --------------------------------------------------------------------- */
    /* 2. RESEND REGISTRATION LINK */
    /* --------------------------------------------------------------------- */
    @Override
    @Transactional
    public void resendRegistrationLink(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (RegistrationStatus.REGISTERED.equals(user.getRegistrationStatus())) {
            throw new IllegalArgumentException("User already completed registration");
        }

        user.setRegistrationToken(UUID.randomUUID().toString());
        user.setTokenGeneratedAt(LocalDateTime.now());
        userRepository.save(user);

        String link = buildRegistrationLink(user.getRegistrationToken());
        emailService.sendRegistrationLink(user.getEmail(), link);
    }

    /* --------------------------------------------------------------------- */
    /* 3. COMPLETE REGISTRATION */
    /* --------------------------------------------------------------------- */
    @Override
    @Transactional
    public void completeRegistration(CompleteRegistrationRequest request) {
        User user = userRepository.findByRegistrationToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired registration token"));

        if (user.getTokenGeneratedAt() == null ||
                Duration.between(user.getTokenGeneratedAt(), LocalDateTime.now()).toHours() > TOKEN_VALIDITY_HOURS) {
            throw new IllegalArgumentException("Registration link has expired");
        }

        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        String username = request.getUsername();
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        username = username.trim();
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username '" + username + "' is already taken.");
        }
        user.setUsername(username);

        user.setRegistrationStatus(RegistrationStatus.REGISTERED);
        user.setIsActive(true);
        user.setIsEmailVerified(true);
        user.setRegistrationToken(null);
        user.setTokenGeneratedAt(null);

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
        userRepository.save(user);

        UserVerification verification = new UserVerification();
        verification.setUser(user);
        verification.setOtpCode(UUID.randomUUID().toString());
        verification.setIsUsed(true);
        verification.setCreatedAt(LocalDateTime.now());
        verification.setExpiresAt(LocalDateTime.now().plusDays(1));
        userVerificationRepository.save(verification);

        memberRepository.findByUser(user).forEach(member -> {
            if (request.getFitnessGoal() != null)
                member.setFitnessGoal(request.getFitnessGoal());
            if (request.getWorkoutTimeSlot() != null)
                member.setWorkoutTimeSlot(request.getWorkoutTimeSlot());
            member.setUpdatedAt(LocalDateTime.now());
            memberRepository.save(member);
        });
    }

    private String buildRegistrationLink(String token) {
        return frontendUrl + "/register/complete?token=" + token;
    }

    /* --------------------------------------------------------------------- */
    /* 4. READ OPERATIONS */
    /* --------------------------------------------------------------------- */
    @Override
    public Member getMemberById(Integer memberId) {
        return memberRepository.findActiveById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found or deleted"));
    }

    @Override
    public Member getMemberByUserId(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return memberRepository.findByUser(user).stream()
                .filter(m -> Boolean.TRUE.equals(m.getIsActive()) && m.getDeletedAt() == null)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Member not found or deleted"));
    }

    @Override
    public List<Member> getAllMembers() {
        return memberRepository.findAllActive();
    }

    @Override
    public List<Member> getAllMembersByAdminId(Integer adminId) {
        return memberRepository.findActiveMembersByAdminId(adminId);
    }

    @Override
    public List<Member> searchMembers(String keyword) {
        return keyword == null || keyword.trim().isEmpty()
                ? memberRepository.findAllActive()
                : memberRepository.searchActiveMembers(keyword);
    }

    /* --------------------------------------------------------------------- */
    /* 5. UPDATE MEMBER + RENEWAL LOGIC */
    /* --------------------------------------------------------------------- */
    @Override
    @Transactional
    public Member updateMember(Integer memberId, UpdateMemberRequest request) {
        Member member = memberRepository.findActiveById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found or deleted"));

        User user = member.getUser();
        UserProfile profile = user.getUserProfile();

        // Full Name
        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            String[] parts = request.getFullName().trim().split("\\s+", 2);
            if (profile == null) {
                profile = new UserProfile();
                profile.setUser(user);
                user.setUserProfile(profile);
            }
            profile.setFirstName(parts[0]);
            profile.setLastName(parts.length > 1 ? parts[1] : "");
        }

        // Contact
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email already in use: " + request.getEmail());
            }
            user.setEmail(request.getEmail());
        }
        if (request.getPhoneNo() != null) {
            user.setPhoneNumber(request.getPhoneNo());
        }

        // PLAN RENEWAL / EXTENSION
        if (request.getMonthsPaid() != null && request.getMonthsPaid() > 0) {
            member.setMonthsPaid(request.getMonthsPaid());
            member.setMonthsFree(request.getMonthsFree() != null ? request.getMonthsFree() : 0);
            member.setPlanStartDate(LocalDate.now()); // THIS IS THE KEY LINE
            member.setMembershipPlan(request.getMonthsPaid() + " months" +
                    (request.getMonthsFree() > 0 ? " + " + request.getMonthsFree() + " free" : ""));
        } else if (request.getMonthsFree() != null) {
            member.setMonthsFree(request.getMonthsFree());
        }

        // Timing
        if (request.getWorkoutTimeSlot() != null) {
            member.setWorkoutTimeSlot(request.getWorkoutTimeSlot());
        }

        // Money
        if (request.getRegistrationFee() != null)
            member.setRegistrationFee(request.getRegistrationFee());
        if (request.getPlanPrice() != null)
            member.setPlanPrice(request.getPlanPrice());
        if (request.getDiscount() != null)
            member.setDiscount(request.getDiscount());
        double total = member.getRegistrationFee() + member.getPlanPrice() - member.getDiscount();
        member.setTotalAmount(Math.max(0, total));
        member.setAmountPaid(total);

        // Misc
        if (request.getPaymentMethod() != null)
            member.setPaymentMethod(request.getPaymentMethod());
        if (request.getJoiningDate() != null)
            member.setJoiningDate(request.getJoiningDate());

        member.setUpdatedAt(LocalDateTime.now());

        if (profile != null)
            userProfileRepository.save(profile);
        userRepository.save(user);
        return memberRepository.save(member);
    }

    /* --------------------------------------------------------------------- */
    /* 6. SOFT DELETE */
    /* --------------------------------------------------------------------- */
    @Override
    @Transactional
    public void deleteMember(Integer memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));

        if (Boolean.FALSE.equals(member.getIsActive()) || member.getDeletedAt() != null) {
            throw new IllegalArgumentException("Member already deleted");
        }

        if (member.getTrainer() != null) {
            member.setTrainer(null);
        }

        member.setIsActive(false);
        member.setDeletedAt(LocalDateTime.now());
        member.setUpdatedAt(LocalDateTime.now());
        memberRepository.save(member);
    }

    @Override
    public List<Member> getMembersByGymId(Long gymId) {
        return memberRepository.findActiveMembersByGymId(gymId);
    }

    @Override
    public List<Member> getMembersByTrainerAndGym(Integer trainerId, Long gymId) {
        return memberRepository.findActiveMembersByTrainerIdAndGymId(trainerId, gymId);
    }

    @Override
    @Transactional
    public void removeMemberFromTrainer(Integer memberId, Long gymId) {
        Member member = memberRepository.findActiveById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found or inactive"));

        if (!member.getGym().getGymId().equals(gymId)) {
            throw new IllegalArgumentException("Member does not belong to gym ID: " + gymId);
        }

        if (member.getTrainer() == null) {
            throw new IllegalArgumentException("Member is not assigned to any trainer");
        }

        if (!member.getTrainer().getGym().getGymId().equals(gymId)) {
            throw new IllegalArgumentException("Trainer does not belong to this gym");
        }

        member.setTrainer(null);
        member.setUpdatedAt(LocalDateTime.now());
        memberRepository.save(member);
    }

    /* --------------------------------------------------------------------- */
    /* 7. ACCURATE EXPIRY CALCULATION LOGIC */
    /* --------------------------------------------------------------------- */
    private LocalDate getEffectivePlanStartDate(Member member) {
        return member.getPlanStartDate() != null
                ? member.getPlanStartDate()
                : member.getJoiningDate();
    }

    private LocalDate calculateExpiryDate(Member member) {
        LocalDate start = getEffectivePlanStartDate(member);
        int totalMonths = member.getMonthsPaid()
                + (member.getMonthsFree() != null ? member.getMonthsFree() : 0);
        return start.plusMonths(totalMonths).minusDays(1);
    }

    @Override
    public List<MemberWithExpiryResponse> getAllMembersWithExpiry() {
        return memberRepository.findAllActive().stream()
                .map(MemberWithExpiryResponse::new)
                .sorted((a, b) -> a.getPlanExpiryDate().compareTo(b.getPlanExpiryDate()))
                .toList();
    }

    @Override
    public void sendSingleExpiryReminder(Integer memberId) {
        Member member = memberRepository.findActiveById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found or inactive"));
        sendExpiryEmailIfNeeded(member);
    }

    @Override
    public int sendAllExpiryReminders() {
        List<Member> activeMembers = memberRepository.findAllActive();
        int sentCount = 0;
        for (Member member : activeMembers) {
            if (sendExpiryEmailIfNeeded(member)) {
                sentCount++;
            }
        }
        return sentCount;
    }

    /**
     * FINAL FIXED METHOD — This is the only one you needed to change!
     * Now uses plan_start_date correctly → No false reminders ever again
     */
    private boolean sendExpiryEmailIfNeeded(Member member) {
        LocalDate expiryDate = calculateExpiryDate(member);
        long daysRemaining = ChronoUnit.DAYS.between(LocalDate.now(), expiryDate);

        // ONLY send if 10 days or less remaining OR already expired
        if (daysRemaining > 10) {
            return false; // GREEN → NO EMAIL ALLOWED
        }

        String firstName = member.getUser().getUserProfile() != null
                ? member.getUser().getUserProfile().getFirstName()
                : "Member";

        emailService.sendMembershipExpiryEmail(
                member.getUser().getEmail(),
                firstName,
                expiryDate,
                daysRemaining);

        return true;
    }

    @Override
    public boolean hasTrainer(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return memberRepository.findByUser(user).stream()
                .anyMatch(m -> m.getTrainer() != null);
    }

    @Override
    @Transactional
    public Member updateMemberProfile(Integer userId,
            com.gymmanagement.usermanagement.Request.MemberProfileUpdateRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Member> members = memberRepository.findByUser(user).stream()
                .filter(m -> Boolean.TRUE.equals(m.getIsActive()))
                .toList();

        if (members.isEmpty()) {
            throw new IllegalArgumentException("Member profile not found");
        }

        // 1. Update Member-specific fields for ALL active memberships
        for (Member member : members) {
            if (req.getFitnessGoal() != null) {
                member.setFitnessGoal(req.getFitnessGoal());
            }
            member.setUpdatedAt(LocalDateTime.now());
            memberRepository.save(member);
        }

        Member primaryMember = members.get(0);

        // 2. Update User Contact Info
        if (req.getPhoneNumber() != null && !req.getPhoneNumber().equals(user.getPhoneNumber())) {
            // Check duplication if strictly enforced, though usually safe for phone
            user.setPhoneNumber(req.getPhoneNumber());
            userRepository.save(user); // Save user update
        }

        // 3. Update User Profile
        UserProfile profile = user.getUserProfile();
        if (profile == null) {
            profile = new UserProfile();
            profile.setUser(user);
        }

        if (req.getFirstName() != null)
            profile.setFirstName(req.getFirstName());
        if (req.getLastName() != null)
            profile.setLastName(req.getLastName());
        if (req.getAddress() != null)
            profile.setAddress(req.getAddress());
        if (req.getGender() != null)
            profile.setGender(req.getGender());
        if (req.getDateOfBirth() != null)
            profile.setDateOfBirth(req.getDateOfBirth());

        user.setUserProfile(profile);
        userProfileRepository.save(profile);

        // 4. Update timestamps and return primary member
        return primaryMember;
    }
}