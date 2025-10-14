package com.gymmanagement.usermanagement.service.impl;

import com.gymmanagement.commonservices.entity.Gym;
import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.commonservices.entity.User;
import com.gymmanagement.commonservices.enumeration.RegistrationStatus;
import com.gymmanagement.commonservices.enumeration.Role;
import com.gymmanagement.usermanagement.Request.AdminAddMemberRequest;
import com.gymmanagement.usermanagement.Request.CompleteRegistrationRequest;
import com.gymmanagement.usermanagement.Request.UpdateMemberRequest;
import com.gymmanagement.usermanagement.repository.GymRepository;
import com.gymmanagement.usermanagement.repository.MemberRepository;
import com.gymmanagement.usermanagement.repository.UserRepository;
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

    private static final long TOKEN_VALIDITY_HOURS = 24;

    public MemberServiceImpl(MemberRepository memberRepository,
                             UserRepository userRepository,
                             EmailService emailService,
                             GymRepository gymRepository,
                             PasswordEncoder passwordEncoder) {
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
		this.gymRepository = gymRepository;
    }

    @Override
    @Transactional
    public Member addMemberByAdmin(AdminAddMemberRequest req) {

        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already exists");

        // Fetch gym
        Gym gym = gymRepository.findById(req.getGymId().longValue())
                .orElseThrow(() -> new RuntimeException("Gym not found with ID: " + req.getGymId()));

        // Create user with PENDING registration
        User user = new User();
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setEmail(req.getEmail());
        user.setPhoneNumber(req.getPhoneNumber());
        user.setRole(Role.MEMBER);
        user.setRegistrationStatus(RegistrationStatus.PENDING);
        user.setRegistrationToken(UUID.randomUUID().toString());
        user.setTokenGeneratedAt(LocalDateTime.now());

        userRepository.save(user);

        // Create member profile
        Member member = new Member();
        member.setUser(user);
        member.setGym(gym);  // ✅ Assign gym
        member.setMembershipPlan(req.getMembershipPlan());
        member.setJoiningDate(req.getJoiningDate());
        member.setAmountPaid(req.getAmountPaid());
        member.setPaymentMethod(req.getPaymentMethod());
        member.setWorkoutTimeSlot(req.getWorkoutTimeSlot());
        member.setCreatedAt(LocalDateTime.now());
        member.setUpdatedAt(LocalDateTime.now());
        memberRepository.save(member);

        // Send registration email
        String link = buildRegistrationLink(user.getRegistrationToken());
        emailService.sendRegistrationLink(user.getEmail(), link);

        return member;
    }

    @Override
    @Transactional
    public void resendRegistrationLink(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (RegistrationStatus.REGISTERED.equals(user.getRegistrationStatus()))
            throw new RuntimeException("User already registered");

        user.setRegistrationToken(UUID.randomUUID().toString());
        user.setTokenGeneratedAt(LocalDateTime.now());
        userRepository.save(user);

        String link = buildRegistrationLink(user.getRegistrationToken());
        emailService.sendRegistrationLink(user.getEmail(), link);
    }

    @Override
    @Transactional
    public void completeRegistration(CompleteRegistrationRequest request) {
        User user = userRepository.findByRegistrationToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        if (user.getTokenGeneratedAt() == null ||
            Duration.between(user.getTokenGeneratedAt(), LocalDateTime.now()).toHours() > TOKEN_VALIDITY_HOURS)
            throw new RuntimeException("Registration link expired");

        // Set password & mark registered
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRegistrationStatus(RegistrationStatus.REGISTERED);
        user.setRegistrationToken(null);
        user.setTokenGeneratedAt(null);

        if (request.getGender() != null) user.setGender(request.getGender());
        if (request.getAge() != null && request.getDateOfBirth() == null)
            user.setDateOfBirth(LocalDateTime.now().minusYears(request.getAge()).toLocalDate());

        userRepository.save(user);

        // Update member profile with remaining info
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

    // Existing methods: getById, getByUserId, update, delete, search
    @Override
    public Member getMemberById(Integer memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));
    }

    @Override
    public Member getMemberByUserId(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return memberRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Member not found"));
    }

    @Override
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    @Override
    @Transactional
    public Member updateMember(Integer memberId, UpdateMemberRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        if (request.getFitnessGoal() != null) member.setFitnessGoal(request.getFitnessGoal());
        if (request.getMembershipPlan() != null) member.setMembershipPlan(request.getMembershipPlan());
        if (request.getJoiningDate() != null) member.setJoiningDate(request.getJoiningDate());
        if (request.getAmountPaid() != null) member.setAmountPaid(request.getAmountPaid());
        if (request.getPaymentMethod() != null) member.setPaymentMethod(request.getPaymentMethod());
        if (request.getWorkoutTimeSlot() != null) member.setWorkoutTimeSlot(request.getWorkoutTimeSlot());

        member.setUpdatedAt(LocalDateTime.now());
        return memberRepository.save(member);
    }

    @Override
    @Transactional
    public void deleteMember(Integer memberId) {
        if (!memberRepository.existsById(memberId))
            throw new RuntimeException("Member not found");
        memberRepository.deleteById(memberId);
    }

    @Override
    public List<Member> searchMembers(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) return memberRepository.findAll();
        return memberRepository.findByMembershipPlanContainingIgnoreCase(keyword);
    }
}
