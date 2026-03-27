import { attendanceApi } from './api';

// Attendance endpoints on Port 8085 do NOT use the /api prefix.
// Valid routes are /attendance/* as per latest backend spec.

export const attendanceService = {
  // 1. Mark Attendance (Toggle)
  markAttendance: async () => {
    // Uses attendanceApi (Base URL: http://localhost:8085 via proxy)
    // POST /attendance/mark (No body/params needed for toggle)
    const response = await attendanceApi.post('/attendance/mark');
    return response.data;
  },

  // 2. Check Today's Status
  checkTodayStatus: async () => {
    const response = await attendanceApi.get('/attendance/today');
    return response.data; // Returns true/false
  },

  // 3. Get History (Member/Trainer)
  getHistory: async () => {
    const response = await attendanceApi.get('/attendance/history');
    return response.data;
  },

  // 4. Get Current Streak
  getStreak: async () => {
    const response = await attendanceApi.get('/attendance/streak');
    return response.data;
  },

  // 4. Admin: Get Gym Attendance (Enhanced with Date & Sort)
  getGymAttendance: async (gymId, { date, sortBy, direction } = {}) => {
    let url = `/attendance/admin/gym/${gymId}`;
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (sortBy) params.append('sortBy', sortBy);
    if (direction) params.append('direction', direction);
    
    if (Array.from(params).length > 0) {
        url += `?${params.toString()}`;
    }

    const response = await attendanceApi.get(url);
    return response.data;
  },

  // 5. Admin: Get User History
  getUserHistory: async (userId) => {
    const response = await attendanceApi.get(`/attendance/admin/user/${userId}`);
    return response.data;
  },

  // 6. Admin: Manual Update
  updateUserAttendance: async (payload) => {
    // payload: { userId, date, status }
    const response = await attendanceApi.post('/attendance/admin/update', payload);
    return response.data;
  }
};
