package com.gymmanagement.usermanagement.service;

import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.usermanagement.Request.AdminAddMemberRequest;
import com.gymmanagement.usermanagement.Request.CompleteRegistrationRequest;
import com.gymmanagement.usermanagement.Request.UpdateMemberRequest;

import java.util.List;

public interface MemberService {
    Member addMemberByAdmin(AdminAddMemberRequest request);        // admin adds
    void resendRegistrationLink(Integer userId);                   // admin resend invite
    void completeRegistration(CompleteRegistrationRequest request); // member completes
    Member getMemberById(Integer memberId);
    Member getMemberByUserId(Integer userId);
    List<Member> getAllMembers();
    Member updateMember(Integer memberId, UpdateMemberRequest request);
    void deleteMember(Integer memberId);
    List<Member> searchMembers(String keyword);
}
