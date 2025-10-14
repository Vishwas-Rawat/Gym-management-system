package com.gymmanagement.usermanagement.repository;

import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.commonservices.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Integer> {
    
    // Find by linked user object
    Optional<Member> findByUser(User user);

    // Find by userId directly
    Optional<Member> findByUser_UserId(Integer userId);

    // Search by membership plan
    List<Member> findByMembershipPlanContainingIgnoreCase(String membershipPlan);

    // (Optional) expand if you want keyword search on other fields later
    // List<Member> findByFitnessGoalContainingIgnoreCase(String goal);
}
