package com.gymmanagement.usermanagement.service;

import com.gymmanagement.usermanagement.Response.MemberDashboardResponse;

public interface MemberDashboardService {
    MemberDashboardResponse getDashboard(Integer userId);
}
