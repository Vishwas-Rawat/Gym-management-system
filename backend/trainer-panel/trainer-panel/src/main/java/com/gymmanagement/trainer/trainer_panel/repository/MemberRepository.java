package com.gymmanagement.trainer.trainer_panel.repository;

import com.gymmanagement.commonservices.entity.Member;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Integer> {
	Optional<Member> findByUser_UserId(Integer userId);

}
