package com.gymmanagement.usermanagement.service;

import com.gymmanagement.usermanagement.Response.AdminProfileResponse;

public interface AdminProfileService {

    AdminProfileResponse getAdminProfileByEmail(String email);

    AdminProfileResponse getAdminProfileById(Integer userId);
}
