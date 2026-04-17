import React, { useEffect } from 'react';
import { CheckCircle, Cancel, AccessTime } from '@mui/icons-material';
import { useAttendance } from '../context/AttendanceContext';
import { motion } from 'framer-motion';
import '../styles/dashboard.css';

const AttendanceWidget = ({ onAttendanceUpdate }) => {
  const { loading, error, todayStatus, markAttendance, checkTodayAttendance } = useAttendance();

  useEffect(() => {
    checkTodayAttendance();
  }, []);

  const handleMarkAttendance = async () => {
    await markAttendance();
    if (onAttendanceUpdate) onAttendanceUpdate();
  };

  return (
    <div className="db-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '300px' }}>
      <h3 style={{ color: 'var(--db-text-secondary)', marginBottom: '1.5rem' }}>
        Today's Attendance
      </h3>

      {loading ? (
         <div className="spinner" style={{ borderTopColor: 'var(--db-accent)' }}></div>
      ) : (
        <>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            style={{ width: '100%' }}
          >
            {todayStatus === 'PRESENT' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--db-green)' }}>
                <CheckCircle style={{ fontSize: 60, marginBottom: '0.5rem' }} />
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Present</h2>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Marked for today</div>
                <button 
                  onClick={() => handleMarkAttendance()}
                  style={{ 
                      marginTop: '1rem', 
                      background: 'transparent', 
                      border: 'none', 
                      color: 'var(--db-red)', 
                      cursor: 'pointer', 
                      fontSize: '0.8rem',
                      textDecoration: 'underline'
                  }}
                >
                  Unmark
                </button>
              </div>
            ) : todayStatus === 'ABSENT' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--db-red)' }}>
                <Cancel style={{ fontSize: 60, marginBottom: '0.5rem' }} />
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Absent</h2>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Marked for today</div>
                <button 
                  onClick={() => handleMarkAttendance()}
                  style={{ 
                      marginTop: '1rem', 
                      background: 'transparent', 
                      border: 'none', 
                      color: 'var(--db-blue)', 
                      cursor: 'pointer', 
                      fontSize: '0.8rem', 
                      textDecoration: 'underline' 
                  }}
                >
                  Mark Present
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--db-text-secondary)' }}>
                <AccessTime style={{ fontSize: 60, marginBottom: '0.5rem' }} />
                <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--db-text-primary)' }}>Not Marked</h2>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Please mark your attendance</div>
              </div>
            )}
          </motion.div>

          {todayStatus !== 'PRESENT' && todayStatus !== 'ABSENT' && (
            <button
              className="db-btn db-btn-primary"
              onClick={() => handleMarkAttendance()}
              disabled={loading}
              style={{ marginTop: '2rem', padding: '0.8rem 2rem', fontSize: '1rem' }}
            >
              Mark Attendance
            </button>
          )}

          {error && (
            <div style={{ marginTop: '1rem', color: 'var(--db-red)', fontSize: '0.9rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AttendanceWidget;
