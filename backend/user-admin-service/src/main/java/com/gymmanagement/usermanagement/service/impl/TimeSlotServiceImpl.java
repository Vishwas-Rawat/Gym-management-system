package com.gymmanagement.usermanagement.service.impl;

import com.gymmanagement.commonservices.entity.TimeSlot;
import com.gymmanagement.commonservices.entity.Gym;
import com.gymmanagement.usermanagement.repository.TimeSlotRepository;
import com.gymmanagement.usermanagement.repository.GymRepository;
import com.gymmanagement.usermanagement.service.TimeSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TimeSlotServiceImpl implements TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;
    private final GymRepository gymRepository;

    @Override
    public List<TimeSlot> getAllTimeSlotsByGym(Long gymId) {
        Gym gym = gymRepository.findById(gymId)
                .orElseThrow(() -> new IllegalArgumentException("Gym not found"));
        return timeSlotRepository.findByGymAndIsActiveTrue(gym);
    }

    @Override
    public TimeSlot createTimeSlot(TimeSlot timeSlot) {
        return timeSlotRepository.save(timeSlot);
    }

    @Override
    public TimeSlot getTimeSlotById(Integer id) {
        return timeSlotRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Time Slot not found"));
    }
}
