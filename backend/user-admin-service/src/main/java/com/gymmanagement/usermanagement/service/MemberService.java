package com.gymmanagement.usermanagement.service;

import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.usermanagement.Request.AdminAddMemberRequest;
import com.gymmanagement.usermanagement.Request.CompleteRegistrationRequest;
import com.gymmanagement.usermanagement.Request.UpdateMemberRequest;
import com.gymmanagement.usermanagement.Response.AddMemberResponse;
import com.gymmanagement.usermanagement.Response.MemberWithExpiryResponse;

import java.util.List;

public interface MemberService {

    List<AddMemberResponse> addMultipleMembersByAdmin(List<AdminAddMemberRequest> requests);

    void resendRegistrationLink(Integer userId);

    void completeRegistration(CompleteRegistrationRequest request);

    Member getMemberById(Integer memberId);

    Member getMemberByUserId(Integer userId);

    List<Member> getAllMembers();

    // ✅ New: Get all members for an admin's gyms
    List<Member> getAllMembersByAdminId(Integer adminId);

    Member updateMember(Integer memberId, UpdateMemberRequest request);

    void deleteMember(Integer memberId); // soft delete

    List<Member> searchMembers(String keyword);

    List<Member> getMembersByGymId(Long gymId);

    List<Member> getMembersByTrainerAndGym(Integer trainerId, Long gymId);

    void removeMemberFromTrainer(Integer memberId, Long gymId);

    List<MemberWithExpiryResponse> getAllMembersWithExpiry();

    void sendSingleExpiryReminder(Integer memberId);

    int sendAllExpiryReminders();

    boolean hasTrainer(Integer userId);

    Member updateMemberProfile(Integer userId,
            com.gymmanagement.usermanagement.Request.MemberProfileUpdateRequest request);
}