package com.gymmanagement.usermanagement.service;

import java.util.List;

import com.gymmanagement.commonservices.entity.Gym;
import com.gymmanagement.usermanagement.Response.GymRegisterResponse;

public interface GymService {
    List<GymRegisterResponse> createGyms(List<Gym> gyms, Integer adminId); // ✅ added

    public List<GymRegisterResponse> getAllGymsByAdmin(int adminId);

    GymRegisterResponse updateGym(Long gymId, Gym updatedGym, Integer adminId);

    boolean softDeleteGym(Long gymId, Integer adminId);

    // ✅ Force Delete (Cascading Soft Delete)
    void forceDeleteGym(Long gymId, Integer adminId);

}
