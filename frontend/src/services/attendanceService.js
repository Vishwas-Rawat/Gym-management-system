import { attendanceApi } from './api';

// Base path is likely /api/attendance based on typical usage, 
// even if docs say /attendance/*, usually the global prefix is /api.

export const attendanceService = {
  // 1. Mark Attendance
  markAttendance: async (status = 'PRESENT') => {
    const response = await attendanceApi.post(`/api/attendance/mark?status=${status}`);
    return response.data;
  },

  // 2. Check Today's Status
  checkTodayStatus: async () => {
    const response = await attendanceApi.get('/api/attendance/today');
    return response.data; // Returns true/false
  },

  // 3. Get History (Member/Trainer)
  getHistory: async () => {
    const response = await attendanceApi.get('/api/attendance/history');
    return response.data;
  },

  // 4. Get Current Streak
  getStreak: async () => {
    const response = await attendanceApi.get('/api/attendance/streak');
    return response.data;
  },

  // 4. Admin: Get Gym Attendance
  getGymAttendance: async (gymId) => {
    const response = await attendanceApi.get(`/api/attendance/admin/gym/${gymId}`);
    return response.data;
  },

  // 5. Admin: Get User History
  getUserHistory: async (userId) => {
    const response = await attendanceApi.get(`/api/attendance/admin/user/${userId}`);
    return response.data;
  }
};
