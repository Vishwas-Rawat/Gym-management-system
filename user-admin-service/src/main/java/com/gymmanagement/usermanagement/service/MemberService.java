package com.gymmanagement.usermanagement.service;

import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.usermanagement.Request.AddMemberRequest;
import com.gymmanagement.usermanagement.Request.UpdateMemberRequest;

import java.util.List;

public interface MemberService {
    Member addMember(AddMemberRequest request);
    Member getMemberById(Integer memberId);
    Member getMemberByUserId(Integer userId);  // ✅ replaced getMemberByEmail
    List<Member> getAllMembers();
    Member updateMember(Integer memberId, UpdateMemberRequest request);
    void deleteMember(Integer memberId);
    List<Member> searchMembers(String keyword);
}
