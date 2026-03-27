package com.gymmanagement.usermanagement.service;

import java.util.List;
import com.gymmanagement.commonservices.entity.Gym;
import com.gymmanagement.usermanagement.Response.GymRegisterResponse;

public interface GymService {

    List<GymRegisterResponse> createGyms(List<Gym> gyms, String adminEmail);

    List<GymRegisterResponse> getAllGymsByAdmin(String adminEmail);

    GymRegisterResponse updateGym(Long gymId, Gym updatedGym, String adminEmail);

    boolean softDeleteGym(Long gymId, String adminEmail);
}
