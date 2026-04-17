package com.gymmanagement.trainer.trainer_panel.repository;

import com.gymmanagement.commonservices.entity.AttendanceLog;

import org.springframework.data.repository.query.Param;

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

	@Query("SELECT new com.gymmanagement.trainer.trainer_panel.dto.TimeChartDataDTO(a.date, COUNT(a)) " +
			"FROM AttendanceLog a WHERE a.date >= :startDate AND a.status = 'PRESENT' " +
			"AND a.userId IN (SELECT m.user.userId FROM Member m WHERE m.trainer.trainerId = :trainerId) " +
			"GROUP BY a.date ORDER BY a.date ASC")
	List<com.gymmanagement.trainer.trainer_panel.dto.TimeChartDataDTO> getAttendanceTrends(
			@Param("trainerId") Integer trainerId, @Param("startDate") LocalDate startDate);

	@Query("SELECT new com.gymmanagement.trainer.trainer_panel.dto.MemberConsistencyDTO(m.memberId, m.user.username, COUNT(a)) "
			+
			"FROM AttendanceLog a JOIN Member m ON a.userId = m.user.userId " +
			"WHERE m.trainer.trainerId = :trainerId AND a.date >= :startDate AND a.status = 'PRESENT' " +
			"GROUP BY m.memberId, m.user.username ORDER BY COUNT(a) DESC")
	List<com.gymmanagement.trainer.trainer_panel.dto.MemberConsistencyDTO> getConsistencyStats(
			@Param("trainerId") Integer trainerId, @Param("startDate") LocalDate startDate);
}
