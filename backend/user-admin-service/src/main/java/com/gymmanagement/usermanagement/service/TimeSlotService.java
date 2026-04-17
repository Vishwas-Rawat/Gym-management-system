package com.gymmanagement.usermanagement.service;

import com.gymmanagement.commonservices.entity.TimeSlot;
import java.util.List;

public interface TimeSlotService {
    List<TimeSlot> getAllTimeSlotsByGym(Long gymId);

    TimeSlot createTimeSlot(TimeSlot timeSlot);

    TimeSlot getTimeSlotById(Integer id);
}
