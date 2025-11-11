package com.gymmanagement.usermanagement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.gymmanagement.commonservices.entity.Member;
import com.gymmanagement.commonservices.entity.User;

public interface MemberRepository extends JpaRepository<Member, Integer> {

    Optional<Member> findByUser(User user);

    // ACTIVE MEMBERS ONLY
    @Query("SELECT m FROM Member m WHERE m.isActive = true AND m.deletedAt IS NULL")
    List<Member> findAllActive();

    @Query("SELECT m FROM Member m WHERE m.memberId = :id AND m.isActive = true AND m.deletedAt IS NULL")
    Optional<Member> findActiveById(@Param("id") Integer id);

    @Query("SELECT m FROM Member m WHERE m.isActive = true AND m.deletedAt IS NULL " +
           "AND (LOWER(m.user.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(m.user.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(m.user.email) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(m.user.phoneNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(m.membershipPlan) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Member> searchActiveMembers(@Param("keyword") String keyword);
    
    
    @Query("""
    	    SELECT m FROM Member m
    	    WHERE m.gym.gymId = :gymId 
    	      AND m.isActive = true 
    	      AND m.deletedAt IS NULL
    	""")
    	List<Member> findActiveMembersByGymId(@Param("gymId") Long gymId);
}