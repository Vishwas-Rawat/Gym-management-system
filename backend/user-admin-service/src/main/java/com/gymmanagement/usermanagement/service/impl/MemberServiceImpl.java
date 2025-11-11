package com.gymmanagement.usermanagement.service.impl;

import com.gymmanagement.commonservices.entity.*;
import com.gymmanagement.commonservices.enumeration.RegistrationStatus;
import com.gymmanagement.commonservices.enumeration.Role;
import com.gymmanagement.commonservices.enumeration.VerificationType;
import com.gymmanagement.usermanagement.Request.AdminAddMemberRequest;
import com.gymmanagement.usermanagement.Request.CompleteRegistrationRequest;
import com.gymmanagement.usermanagement.Request.UpdateMemberRequest;
import com.gymmanagement.usermanagement.Response.AddMemberResponse;
import com.gymmanagement.usermanagement.repository.*;
import com.gymmanagement.usermanagement.service.EmailService;
import com.gymmanagement.usermanagement.service.MemberService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
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

    private static final long TOKEN_VALIDITY_HOURS = 24;

    public MemberServiceImpl(MemberRepository memberRepository,
                             UserRepository userRepository,
                             EmailService emailService,
                             GymRepository gymRepository,
                             PasswordEncoder passwordEncoder,
                             UserVerificationRepository userVerificationRepository,
                             UserProfileRepository userProfileRepository) {
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
        this.gymRepository = gymRepository;
        this.userVerificationRepository = userVerificationRepository;
        this.userProfileRepository = userProfileRepository;
    }

    /* --------------------------------------------------------------------- */
    /* 1. ADD MULTIPLE MEMBERS (ADMIN)                                      */
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
        // ---- 1. Validate email uniqueness ----
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + req.getEmail());
        }

        // ---- 2. Split fullName → first / last ----
        String[] nameParts = req.getFullName().trim().split("\\s+", 2);
        String firstName = nameParts[0];
        String lastName = nameParts.length > 1 ? nameParts[1] : "";

        // ---- 3. Load Gym ----
        Gym gym = gymRepository.findById(req.getGymId().longValue())
                .orElseThrow(() -> new IllegalArgumentException("Gym not found: " + req.getGymId()));

        // ---- 4. Create User (email + phone mandatory) ----
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(req.getEmail());
        user.setPhoneNumber(req.getPhoneNo());
        user.setRole(Role.MEMBER);
        user.setRegistrationStatus(RegistrationStatus.PENDING);
        user.setRegistrationToken(UUID.randomUUID().toString());
        user.setTokenGeneratedAt(LocalDateTime.now());
        userRepository.save(user);

        // ---- 5. Build workoutTimeSlot (legacy string) ----
        String workoutTimeSlot = buildWorkoutTimeSlot(req);

        // ---- 6. Create Member ----
        Member member = new Member();
        member.setUser(user);
        member.setGym(gym);

        member.setMonthsPaid(req.getMonthsPaid());
        member.setMonthsFree(req.getMonthsFree() != null ? req.getMonthsFree() : 0);

        member.setFromHour(req.getFromHour());
        member.setFromMinute(req.getFromMinute());
        member.setFromPeriod(req.getFromPeriod());
        member.setToHour(req.getToHour());
        member.setToMinute(req.getToMinute());
        member.setToPeriod(req.getToPeriod());

        member.setRegistrationFee(req.getRegistrationFee() != null ? req.getRegistrationFee() : 0.0);
        member.setPlanPrice(req.getPlanPrice() != null ? req.getPlanPrice() : 0.0);
        member.setDiscount(req.getDiscount() != null ? req.getDiscount() : 0.0);

        // ----- totalAmount calculated on server -----
        double total = member.getRegistrationFee() + member.getPlanPrice() - member.getDiscount();
        member.setTotalAmount(Math.max(0, total));

        member.setPaymentMethod(req.getPaymentMethod());
        member.setJoiningDate(req.getJoiningDate());

        // ----- Legacy fields -----
        member.setMembershipPlan(member.getMonthsPaid() + " months" 
                + (member.getMonthsFree() > 0 ? " + " + member.getMonthsFree() + " free" : ""));
        member.setJoiningDate(req.getJoiningDate());
        member.setAmountPaid(member.getTotalAmount());
        member.setWorkoutTimeSlot(workoutTimeSlot.isEmpty() ? null : workoutTimeSlot);

        // ----- Soft-delete defaults -----
        member.setIsActive(true);
        member.setDeletedAt(null);

        memberRepository.save(member);

        // ---- 7. Send registration email ----
        String link = buildRegistrationLink(user.getRegistrationToken());
        emailService.sendRegistrationLink(user.getEmail(), link);

        // ---- 8. Return DTO ----
        return new AddMemberResponse(member, "Member added successfully");
    }


    private String buildWorkoutTimeSlot(AdminAddMemberRequest r) {
        if (r.getFromHour() == null || r.getToHour() == null) return "";
        String from = String.format("%d:%s %s",
                r.getFromHour(),
                r.getFromMinute() != null ? r.getFromMinute() : "00",
                r.getFromPeriod() != null ? r.getFromPeriod() : "");
        String to = String.format("%d:%s %s",
                r.getToHour(),
                r.getToMinute() != null ? r.getToMinute() : "00",
                r.getToPeriod() != null ? r.getToPeriod() : "");
        return (from.trim() + " to " + to.trim()).trim();
    }

    /* --------------------------------------------------------------------- */
    /* 2. RESEND REGISTRATION LINK                                          */
    /* --------------------------------------------------------------------- */
    @Override
    @Transactional
    public void resendRegistrationLink(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (RegistrationStatus.REGISTERED.equals(user.getRegistrationStatus())) {
            throw new IllegalArgumentException("User already registered");
        }
        user.setRegistrationToken(UUID.randomUUID().toString());
        user.setTokenGeneratedAt(LocalDateTime.now());
        userRepository.save(user);

        String link = buildRegistrationLink(user.getRegistrationToken());
        emailService.sendRegistrationLink(user.getEmail(), link);
    }

    /* --------------------------------------------------------------------- */
    /* 3. COMPLETE REGISTRATION (member finishes password etc.)            */
    /* --------------------------------------------------------------------- */
    @Override
    @Transactional
    public void completeRegistration(CompleteRegistrationRequest request) {
        User user = userRepository.findByRegistrationToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired token"));

        if (user.getTokenGeneratedAt() == null ||
            Duration.between(user.getTokenGeneratedAt(), LocalDateTime.now()).toHours() > TOKEN_VALIDITY_HOURS) {
            throw new IllegalArgumentException("Registration link expired");
        }

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRegistrationStatus(RegistrationStatus.REGISTERED);
        user.setRegistrationToken(null);
        user.setTokenGeneratedAt(null);
        user.setIsActive(true);
        user.setIsEmailVerified(true);

        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getDateOfBirth() != null) user.setDateOfBirth(request.getDateOfBirth());
        else if (request.getAge() != null)
            user.setDateOfBirth(LocalDateTime.now().minusYears(request.getAge()).toLocalDate());

        userRepository.save(user);

        // ---- Profile ----
        UserProfile profile = new UserProfile();
        profile.setUser(user);
        profile.setFirstName(user.getFirstName());
        profile.setLastName(user.getLastName());
        profile.setDateOfBirth(user.getDateOfBirth());
        profile.setGender(user.getGender());
        profile.setAddress(user.getAddress());
        profile.setCreatedAt(LocalDateTime.now());
        profile.setUpdatedAt(LocalDateTime.now());
        userProfileRepository.save(profile);

        // ---- Verification record ----
        UserVerification verification = new UserVerification();
        verification.setUser(user);
        verification.setOtpCode(UUID.randomUUID().toString());
        verification.setType(VerificationType.EMAIL);
        verification.setIsUsed(true);
        verification.setCreatedAt(LocalDateTime.now());
        verification.setExpiresAt(LocalDateTime.now().plusHours(24));
        verification.setUpdatedAt(LocalDateTime.now());
        userVerificationRepository.save(verification);

        // ---- Optional member updates (fitness goal, slot) ----
        memberRepository.findByUser(user).ifPresent(member -> {
            if (request.getFitnessGoal() != null) member.setFitnessGoal(request.getFitnessGoal());
            if (request.getWorkoutTimeSlot() != null) member.setWorkoutTimeSlot(request.getWorkoutTimeSlot());
            member.setUpdatedAt(LocalDateTime.now());
            memberRepository.save(member);
        });
    }

    private String buildRegistrationLink(String token) {
        return "http://localhost:3000/register/complete?token=" + token;
    }

    /* --------------------------------------------------------------------- */
    /* 4. READ OPERATIONS (active members only)                            */
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
        return memberRepository.findByUser(user)
                .filter(m -> m.getIsActive() && m.getDeletedAt() == null)
                .orElseThrow(() -> new IllegalArgumentException("Member not found or deleted"));
    }

    @Override
    public List<Member> getAllMembers() {
        return memberRepository.findAllActive();
    }

    @Override
    public List<Member> searchMembers(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) return memberRepository.findAllActive();
        return memberRepository.searchActiveMembers(keyword);
    }

    /* --------------------------------------------------------------------- */
    /* 5. UPDATE MEMBER                                                    */
    /* --------------------------------------------------------------------- */
    @Override
    @Transactional
    public Member updateMember(Integer memberId, UpdateMemberRequest request) {
        Member member = memberRepository.findActiveById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found or deleted"));

        User user = member.getUser();

        // ---- 1. Full Name ----
        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            String[] parts = request.getFullName().trim().split("\\s+", 2);
            user.setFirstName(parts[0]);
            user.setLastName(parts.length > 1 ? parts[1] : "");
        }

        // ---- 2. Contact ----
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email already in use: " + request.getEmail());
            }
            user.setEmail(request.getEmail());
        }
        if (request.getPhoneNo() != null) {
            user.setPhoneNumber(request.getPhoneNo());
        }

        // ---- 3. Plan ----
        if (request.getMonthsPaid() != null || request.getMonthsFree() != null) {
            int paid = request.getMonthsPaid() != null ? request.getMonthsPaid() : member.getMonthsPaid();
            int free = request.getMonthsFree() != null ? request.getMonthsFree() : member.getMonthsFree();
            member.setMonthsPaid(paid);
            member.setMonthsFree(free);
            member.setMembershipPlan(paid + " months" + (free > 0 ? " + " + free + " free" : ""));
        }

        // ---- 4. Timing (Always rebuild workoutTimeSlot if any timing field is sent) ----
        boolean hasTiming = false;
        if (request.getFromHour() != null || request.getToHour() != null) {
            hasTiming = true;

            // Parse fromHour/toHour safely
            member.setFromHour(safeParseInt(request.getFromHour()));
            member.setToHour(safeParseInt(request.getToHour()));
            member.setFromMinute(request.getFromMinute());
            member.setFromPeriod(request.getFromPeriod());
            member.setToMinute(request.getToMinute());
            member.setToPeriod(request.getToPeriod());
        }

        // Rebuild workoutTimeSlot string (same logic as create)
        if (hasTiming && member.getFromHour() != null && member.getToHour() != null) {
            String workoutTimeSlot = buildWorkoutTimeSlot(request);
            member.setWorkoutTimeSlot(workoutTimeSlot.isEmpty() ? null : workoutTimeSlot);
        } else if (request.getFromHour() == null && request.getToHour() == null) {
            member.setWorkoutTimeSlot(null);
            // Clear individual fields
            member.setFromHour(null); member.setFromMinute(null); member.setFromPeriod(null);
            member.setToHour(null);   member.setToMinute(null);   member.setToPeriod(null);
        }

        // ---- 5. Money ----
        if (request.getRegistrationFee() != null) member.setRegistrationFee(request.getRegistrationFee());
        if (request.getPlanPrice() != null) member.setPlanPrice(request.getPlanPrice());
        if (request.getDiscount() != null) member.setDiscount(request.getDiscount());

        double total = member.getRegistrationFee() + member.getPlanPrice() - member.getDiscount();
        member.setTotalAmount(Math.max(0, total));
        member.setAmountPaid(member.getTotalAmount());

        // ---- 6. Misc ----
        if (request.getPaymentMethod() != null) member.setPaymentMethod(request.getPaymentMethod());
        if (request.getJoiningDate() != null) member.setJoiningDate(request.getJoiningDate());

        member.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return memberRepository.save(member);
    }

    // Helper: same as in addSingleMember
    private String buildWorkoutTimeSlot(UpdateMemberRequest r) {
        if (r.getFromHour() == null || r.getToHour() == null) return "";
        String from = String.format("%d:%s %s",
                safeParseInt(r.getFromHour()),
                r.getFromMinute() != null ? r.getFromMinute() : "00",
                r.getFromPeriod() != null ? r.getFromPeriod() : "");
        String to = String.format("%d:%s %s",
                safeParseInt(r.getToHour()),
                r.getToMinute() != null ? r.getToMinute() : "00",
                r.getToPeriod() != null ? r.getToPeriod() : "");
        return (from.trim() + " to " + to.trim()).trim();
    }

    private Integer safeParseInt(String val) {
        try {
            return val != null ? Integer.parseInt(val) : null;
        } catch (NumberFormatException e) {
            return null;
        }
    }

    /* --------------------------------------------------------------------- */
    /* 6. SOFT DELETE                                                       */
    /* --------------------------------------------------------------------- */
    @Override
    @Transactional
    public void deleteMember(Integer memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));
        if (!member.getIsActive() || member.getDeletedAt() != null) {
            throw new IllegalArgumentException("Member already deleted");
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

}