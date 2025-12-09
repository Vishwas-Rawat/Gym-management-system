package com.gymmanagement.trainer.trainer_panel.repository;

import com.gymmanagement.commonservices.entity.AttendanceLog;

import feign.Param;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<AttendanceLog, Long> {

	Optional<AttendanceLog> findByUserIdAndDate(Integer userId, LocalDate date);

	List<AttendanceLog> findByUserIdOrderByDateDesc(Integer userId);

	List<AttendanceLog> findByDate(LocalDate date);

	List<AttendanceLog> findByUserIdInOrderByDateDesc(List<Integer> userIds);

	@Query("""
			    SELECT COUNT(a) FROM AttendanceLog a
			    WHERE a.role = 'MEMBER'
			    AND a.date = :date
			    AND a.userId IN (
			         SELECT m.user.userId FROM Member m WHERE m.trainer.trainerId = :trainerId
			    )
			""")
	long countMembersPresentToday(@Param("trainerId") Integer trainerId,
			@Param("date") LocalDate date);

	long countByUserIdInAndDate(List<Integer> userIds, LocalDate date);

	List<AttendanceLog> findByUserIdInAndDate(List<Integer> userIds, LocalDate date);

	Optional<AttendanceLog> findTopByUserIdOrderByDateDesc(Integer userId);

}
