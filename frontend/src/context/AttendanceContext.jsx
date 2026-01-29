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
  const markAttendance = async (status = 'PRESENT') => {
    setLoading(true);
    setError(null);
    try {
      const data = await attendanceService.markAttendance(status);
      setTodayStatus(status);
      return { success: true, message: data.message || `Attendance marked as ${status}!` };
    } catch (err) {
      console.error("Mark attendance error:", err);
      const msg = err.response?.data?.message || "Failed to mark attendance.";
      setError(msg);
      // Even if error, if it says "already marked", update status
      if (err.response?.status === 400 && msg.includes("already marked")) {
          // If we can't distinguish, we assume PRESENT for basic flows, or better, don't change it if we don't know.
          // But usually this error shouldn't happen with the new API that supports updates.
          // setTodayStatus(status); 
      }
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
        // Since the API only returns boolean, we must fetch history to know if it's PRESENT or ABSENT
        try {
            const historyData = await attendanceService.getHistory();
            // Get local YYYY-MM-DD
            const todayStr = new Date().toLocaleDateString('en-CA'); 
            const todayRecord = historyData.find(r => r.date === todayStr); // Exact match YYYY-MM-DD
            
            if (todayRecord) {
                setTodayStatus(todayRecord.status);
            } else {
                // Fallback: If marked but not found (timezone potential), assume PRESENT
                setTodayStatus('PRESENT');
            }
        } catch (histErr) {
            console.warn("Failed to fetch history for status verification, defaulting to PRESENT", histErr);
            setTodayStatus('PRESENT');
        }
      } else {
        setTodayStatus(null);
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
  const getGymAttendanceStats = async (gymId) => {
    setLoading(true);
    try {
      const data = await attendanceService.getGymAttendance(gymId);
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
        getUserAttendanceHistory
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};
