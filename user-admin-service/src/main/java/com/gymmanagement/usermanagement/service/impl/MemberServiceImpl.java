package com.gymmanagement.usermanagement.service.impl;

import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.commonservices.entity.User;
import com.gymmanagement.commonservices.enumeration.Role;
import com.gymmanagement.usermanagement.Request.AddMemberRequest;
import com.gymmanagement.usermanagement.Request.UpdateMemberRequest;
import com.gymmanagement.usermanagement.repository.MemberRepository;
import com.gymmanagement.usermanagement.repository.UserRepository;
import com.gymmanagement.usermanagement.service.MemberService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final UserRepository userRepository;

    public MemberServiceImpl(MemberRepository memberRepository, UserRepository userRepository) {
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public Member addMember(AddMemberRequest request) {
        // Find the base user
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getUserId()));

        if (user.getRole() != Role.MEMBER) {
            throw new RuntimeException("User is not registered as a MEMBER");
        }

        // Prevent duplicate member entry for same user
        if (memberRepository.findByUser(user).isPresent()) {
            throw new RuntimeException("Member profile already exists for this user");
        }

        Member member = new Member();
        member.setUser(user);
        member.setFitnessGoal(request.getFitnessGoal());
        member.setMembershipPlan(request.getMembershipPlan());
        member.setJoiningDate(request.getJoiningDate() != null ? request.getJoiningDate() : LocalDate.now());
        member.setAmountPaid(request.getAmountPaid());
        member.setPaymentMethod(request.getPaymentMethod());
        member.setWorkoutTimeSlot(request.getWorkoutTimeSlot());
        member.setCreatedAt(LocalDateTime.now());
        member.setUpdatedAt(LocalDateTime.now());

        return memberRepository.save(member);
    }

    @Override
    public Member getMemberById(Integer memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found with ID: " + memberId));
    }

    @Override
    public Member getMemberByUserId(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        return memberRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Member not found for user ID: " + userId));
    }

    @Override
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    @Override
    @Transactional
    public Member updateMember(Integer memberId, UpdateMemberRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found with ID: " + memberId));

        if (request.getFitnessGoal() != null) {
            member.setFitnessGoal(request.getFitnessGoal());
        }
        if (request.getMembershipPlan() != null) {
            member.setMembershipPlan(request.getMembershipPlan());
        }
        if (request.getJoiningDate() != null) {
            member.setJoiningDate(request.getJoiningDate());
        }
        if (request.getAmountPaid() != null) {
            member.setAmountPaid(request.getAmountPaid());
        }
        if (request.getPaymentMethod() != null) {
            member.setPaymentMethod(request.getPaymentMethod());
        }
        if (request.getWorkoutTimeSlot() != null) {
            member.setWorkoutTimeSlot(request.getWorkoutTimeSlot());
        }

        member.setUpdatedAt(LocalDateTime.now());
        return memberRepository.save(member);
    }

    @Override
    @Transactional
    public void deleteMember(Integer memberId) {
        if (!memberRepository.existsById(memberId)) {
            throw new RuntimeException("Member not found with ID: " + memberId);
        }
        memberRepository.deleteById(memberId);
    }

    @Override
    public List<Member> searchMembers(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return memberRepository.findAll();
        }
        // Since name/email are now in User/UserProfile, you can expand search logic later.
        return memberRepository.findByMembershipPlanContainingIgnoreCase(keyword);
    }
}
