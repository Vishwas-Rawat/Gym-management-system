package com.gymmanagement.usermanagement.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.gymmanagement.commonservices.entity.AttendanceLog;

import feign.Param;

public interface AttendanceRepository extends JpaRepository<AttendanceLog, Long> {

    long countByRoleAndDate(String role, LocalDate date);
    
    @Query("""
    	    SELECT COUNT(a) FROM AttendanceLog a
    	    WHERE a.userId = :userId
    	""")
    	long countAttendance(@Param("userId") Integer userId);

    	@Query("""
    	    SELECT a.date FROM AttendanceLog a
    	    WHERE a.userId = :userId
    	    ORDER BY a.date DESC
    	""")
    	List<LocalDate> findAllAttendanceDates(@Param("userId") Integer userId);

}
