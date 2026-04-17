import React, { createContext, useState, useContext } from 'react';
import { attendanceService } from '../services/attendanceService';
import { useAuth } from './AuthContext';

const AttendanceContext = createContext();

export const useAttendance = () => useContext(AttendanceContext);

export const AttendanceProvider = ({ children }) => {
  const [loading, setLoading] = useState(false); // For actions like mark
  const [historyLoading, setHistoryLoading] = useState(false); // For fetching history
  const [error, setError] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null); // 'PRESENT' or null
  const [history, setHistory] = useState([]);

  // Mark Attendance
  // Mark Attendance (Toggle)
  const markAttendance = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await attendanceService.markAttendance();
      
      // API returns { marked: boolean, status: "PRESENT" | "ABSENT", message: string }
      // Update: Screenshot shows status might be missing, so fallback to 'marked' boolean
      const isPresent = data.status === 'PRESENT' || data.marked === true;

      if (isPresent) {
          setTodayStatus('PRESENT');
          // Update history: Find today's record and set to PRESENT
          const todayStr = new Date().toISOString().split('T')[0];
          setHistory(prev => {
              const exists = prev.some(rec => rec.date.startsWith(todayStr));
              if (!exists) {
                 return prev;
              }
              return prev.map(rec => {
                  if (rec.date.startsWith(todayStr)) {
                      return { ...rec, status: 'PRESENT' };
                  }
                  return rec;
              });
          });
          return { success: true, message: data.message || "Marked Present!" };
      } else {
          setTodayStatus('ABSENT');
          // Update history: Find today's record and set to ABSENT
          const todayStr = new Date().toISOString().split('T')[0];
          setHistory(prev => {
              return prev.map(rec => {
                  if (rec.date.startsWith(todayStr)) {
                      return { ...rec, status: 'ABSENT' };
                  }
                  return rec;
              });
          });
          return { success: true, message: data.message || "Attendance toggled off (Absent)" };
      }
    } catch (err) {
      console.error("Mark attendance error:", err);
      const msg = err.response?.data?.message || "Failed to toggle attendance.";
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
      const isMarked = await attendanceService.checkTodayStatus();
      if (isMarked === true) {
        setTodayStatus('PRESENT');
      } else {
        setTodayStatus('ABSENT');
      }
    } catch (err) {
      console.error("Check today attendance error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get History
  const getAttendanceHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await attendanceService.getHistory();
      setHistory(data || []);
    } catch (err) {
      console.error("Get history error:", err);
      setError("Failed to fetch attendance history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  // Admin: Get Gym Stats
  const getGymAttendanceStats = async (gymId, options = {}) => {
    setLoading(true);
    try {
      const data = await attendanceService.getGymAttendance(gymId, options);
      return data;
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
      const data = await attendanceService.getUserHistory(userId);
      return data;
    } catch (err) {
      console.error("Get user history error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Admin: Manual Update
  const adminUpdateAttendance = async (userId, date, status) => {
    try {
      await attendanceService.updateUserAttendance({ userId, date, status });
      return { success: true };
    } catch (err) {
      console.error("Admin update error:", err);
      return { success: false, message: err.response?.data?.message || "Update failed" };
    }
  };

  return (
    <AttendanceContext.Provider
      value={{
        loading,
        historyLoading,
        error,
        todayStatus,
        history,
        markAttendance,
        checkTodayAttendance,
        getAttendanceHistory,
        getGymAttendanceStats,
        getUserAttendanceHistory,
        adminUpdateAttendance
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};
