package com.gymmanagement.usermanagement.repository;

import com.gymmanagement.commonservices.entity.TimeSlot;
import com.gymmanagement.commonservices.entity.Gym;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Integer> {
    List<TimeSlot> findByGymAndIsActiveTrue(Gym gym);
}
