import React, { createContext, useState, useContext } from 'react';
import { attendanceApi as api } from '../services/api';
import { useAuth } from './AuthContext';

const AttendanceContext = createContext();

export const useAttendance = () => useContext(AttendanceContext);

export const AttendanceProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null); // 'PRESENT' or null
  const [history, setHistory] = useState([]);

  // Mark Attendance
  const markAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/attendance/mark');
      setTodayStatus('PRESENT');
      return { success: true, message: "Attendance marked successfully!" };
    } catch (err) {
      console.error("Mark attendance error:", err);
      const msg = err.response?.data?.message || "Failed to mark attendance.";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Check Today's Attendance
  const checkTodayAttendance = async () => {
    setLoading(true);
    try {
      const response = await api.get('/attendance/today');
      // Assuming API returns { marked: true/false, status: 'PRESENT' } or similar
      // Adjust based on actual API response structure
      if (response.data && response.data.marked) {
        setTodayStatus(response.data.status || 'PRESENT');
      } else {
        setTodayStatus(null);
      }
    } catch (err) {
      console.error("Check today attendance error:", err);
      // Don't set global error for this check to avoid blocking UI
    } finally {
      setLoading(false);
    }
  };

  // Get History
  const getAttendanceHistory = async () => {
    setLoading(true);
    try {
      const response = await api.get('/attendance/history');
      setHistory(response.data || []);
    } catch (err) {
      console.error("Get history error:", err);
      setError("Failed to fetch attendance history.");
    } finally {
      setLoading(false);
    }
  };

  // Admin: Get Gym Stats
  const getGymAttendanceStats = async (gymId) => {
    setLoading(true);
    try {
      const response = await api.get(`/attendance/admin/gym/${gymId}`);
      return response.data;
    } catch (err) {
      console.error("Get gym stats error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

   // Admin: Get User History
   const getUserAttendanceHistory = async (userId) => {
    setLoading(true);
    try {
      const response = await api.get(`/attendance/admin/user/${userId}`);
      return response.data;
    } catch (err) {
      console.error("Get user history error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AttendanceContext.Provider
      value={{
        loading,
        error,
        todayStatus,
        history,
        markAttendance,
        checkTodayAttendance,
        getAttendanceHistory,
        getGymAttendanceStats,
        getUserAttendanceHistory
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};
