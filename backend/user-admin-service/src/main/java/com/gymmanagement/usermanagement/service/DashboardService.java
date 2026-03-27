package com.gymmanagement.usermanagement.service;

import com.gymmanagement.usermanagement.Response.DashboardResponse;

public interface DashboardService {
    DashboardResponse getDashboard(Long gymId);
}
