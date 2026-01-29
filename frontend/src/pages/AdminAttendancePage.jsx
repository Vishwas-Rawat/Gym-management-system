import React, { useState, useEffect } from 'react';
import { 
  FitnessCenter, 
  Group, 
  ChevronLeft,
  ChevronRight,
  Favorite,
  SentimentSatisfiedAlt
} from '@mui/icons-material';
import { Switch, alpha } from '@mui/material';
import { useGym } from '../context/GymContext';
import { useAttendance } from '../context/AttendanceContext';
import '../styles/dashboard.css';

const AdminAttendancePage = () => {
  const { gyms, getMyGyms, loading: gymLoading } = useGym();
  const { getGymAttendanceStats, adminUpdateAttendance, loading: attendanceLoading } = useAttendance();

  // Helper to get today's date in YYYY-MM-DD
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const [selectedGymId, setSelectedGymId] = useState('');
  const [filterDate, setFilterDate] = useState(getTodayDate());
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [direction, setDirection] = useState('desc');
  
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch gyms on mount
  useEffect(() => {
    getMyGyms();
  }, []);

  // Set default gym
  useEffect(() => {
    if (gyms.length > 0 && !selectedGymId) {
      setSelectedGymId(gyms[0].gymId);
    }
  }, [gyms, selectedGymId]);

  // Fetch attendance when gym or filters change
  useEffect(() => {
    if (selectedGymId) {
      loadAttendance(selectedGymId);
    }
  }, [selectedGymId, filterDate, showAll, sortBy, direction]);

  const loadAttendance = async (gymId) => {
    setFetchError(null);
    try {
      const options = { date: showAll ? null : filterDate, sortBy, direction };
      const data = await getGymAttendanceStats(gymId, options);
      setAttendanceRecords(data.records || []);
    } catch (err) {
      console.error("Failed to load attendance", err);
      setFetchError("Failed to load attendance records.");
      setAttendanceRecords([]);
    }
  };

  const shiftDate = (days) => {
    const current = new Date(filterDate);
    current.setDate(current.getDate() + days);
    setFilterDate(current.toISOString().split('T')[0]);
  };

  const handleStatusToggle = async (record) => {
      const newStatus = record.status === 'PRESENT' ? 'ABSENT' : 'PRESENT';
      setUpdatingId(record.userId);
      const targetDate = record.date ? record.date.split('T')[0] : filterDate;

      try {
          const result = await adminUpdateAttendance(record.userId, targetDate, newStatus);
          if (result.success) {
              setAttendanceRecords(prev => prev.map(r => r.userId === record.userId ? { ...r, status: newStatus } : r));
          } else {
              alert(result.message || "Failed to update attendance");
          }
      } catch (error) {
          console.error("Update failed", error);
      } finally {
          setUpdatingId(null);
      }
  };

  const totalPresent = attendanceRecords.filter(r => r.status === 'PRESENT').length;
  const trainersPresent = attendanceRecords.filter(r => r.role === 'TRAINER' && r.status === 'PRESENT').length;
  const membersPresent = attendanceRecords.filter(r => r.role === 'MEMBER' && r.status === 'PRESENT').length;

  if (gymLoading && !gyms.length) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-content-inner">
      {/* 1. Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 900, color: 'var(--db-text-primary)' }}>
          ATTENDANCE <span style={{ color: 'var(--db-accent)' }}>PANEL</span>
        </h1>
        <h2 style={{ margin: '0.2rem 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#3b82f6' }}>
          ATTENDANCE LOGS
        </h2>
        <p style={{ margin: 0, color: 'var(--db-text-secondary)', fontSize: '0.9rem', maxWidth: '500px' }}>
          Monitor real-time presence across your gym facilities.
        </p>
      </div>

      {/* 2. Controls Section (Date & Sort) */}
      <div className="attendance-controls-row">
        
        {/* Date Selector */}
        <div style={{ flex: '1 1 260px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label className="attendance-kpi-label">DATE</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className="attendance-kpi-label">ALL</span>
              <input 
                type="checkbox" 
                checked={showAll}
                onChange={(e) => setShowAll(e.target.checked)}
                style={{ accentColor: 'var(--db-accent)', cursor: 'pointer' }} 
              />
            </div>
          </div>
          
          <div className="attendance-date-selector" style={{ opacity: showAll ? 0.6 : 1, pointerEvents: showAll ? 'none' : 'auto' }}>
            <button 
              onClick={() => shiftDate(-1)} 
              disabled={showAll}
              style={{ background: 'none', border: 'none', color: 'var(--db-text-secondary)', padding: '0.4rem', cursor: showAll ? 'not-allowed' : 'pointer', display: 'flex' }}
            >
              <ChevronLeft />
            </button>
            <input 
              type="date"
              disabled={showAll}
              className="attendance-current-date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                padding: '0',
                cursor: showAll ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                outline: 'none',
                textAlign: 'center',
                width: '100%'
              }}
            />
            <button 
              onClick={() => shiftDate(1)} 
              disabled={showAll}
              style={{ background: 'none', border: 'none', color: 'var(--db-text-secondary)', padding: '0.4rem', cursor: showAll ? 'not-allowed' : 'pointer', display: 'flex' }}
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        {/* Sort Selector */}
        <div style={{ flex: '0 0 160px' }}>
          <label className="attendance-kpi-label" style={{ marginBottom: '0.5rem', display: 'block' }}>SORT BY</label>
          <div className="db-select-wrapper">
            <select 
              className="db-select" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Gym Selector */}
      <div className="db-select-wrapper" style={{ marginBottom: '2rem' }}>
        <select 
          className="db-select" 
          value={selectedGymId} 
          onChange={(e) => setSelectedGymId(e.target.value)}
          disabled={gymLoading}
          style={{ width: '100%', padding: '1rem', fontWeight: 700 }}
        >
          {gyms.length > 0 ? (
            gyms.map((gym) => (
              <option key={gym.gymId} value={gym.gymId}>
                {gym.gymName}
              </option>
            ))
          ) : (
            <option>No Gyms Found</option>
          )}
        </select>
      </div>

      {/* 4. KPI Stats */}
      <div className="attendance-kpi-grid">
        <div className="attendance-kpi-card">
          <div className="attendance-kpi-icon" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
            <Group style={{ color: '#3b82f6', fontSize: '1.4rem' }} />
          </div>
          <div className="attendance-kpi-label">TOTAL PRESENT</div>
          <div className="attendance-kpi-value">{totalPresent}</div>
        </div>

        <div className="attendance-kpi-card">
          <div className="attendance-kpi-icon" style={{ background: 'rgba(236, 72, 153, 0.1)' }}>
            <Favorite style={{ color: '#ec4899', fontSize: '1.4rem' }} />
          </div>
          <div className="attendance-kpi-label">TRAINERS</div>
          <div className="attendance-kpi-value">{trainersPresent}</div>
        </div>

        <div className="attendance-kpi-card">
          <div className="attendance-kpi-icon" style={{ background: 'rgba(234, 179, 8, 0.1)' }}>
            <SentimentSatisfiedAlt style={{ color: '#eab308', fontSize: '1.4rem' }} />
          </div>
          <div className="attendance-kpi-label">MEMBERS</div>
          <div className="attendance-kpi-value">{membersPresent}</div>
        </div>
      </div>

      {/* 5. Result List */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '0 1rem', marginBottom: '1rem' }}>
        <div className="attendance-kpi-label">USER DETAILS</div>
        <div className="attendance-kpi-label" style={{ textAlign: 'center' }}>ROLE</div>
        <div className="attendance-kpi-label" style={{ textAlign: 'center' }}>STATUS</div>
        <div className="attendance-kpi-label" style={{ textAlign: 'right' }}>ACTION</div>
      </div>
      <div style={{ height: '1px', background: 'var(--db-border)', marginBottom: '1rem' }}></div>

      <div style={{ minHeight: '300px' }}>
        {attendanceLoading ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}><div className="spinner"></div></div>
        ) : attendanceRecords.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--db-text-secondary)', fontSize: '0.9rem' }}>
              No attendance records found.
            </div>
        ) : (
          attendanceRecords.map((record) => (
            <div key={record.userId} className="attendance-record-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <div style={{ 
                        width: '36px', height: '36px', fontSize: '0.85rem', fontWeight: 800,
                        backgroundColor: record.role === 'TRAINER' ? 'rgba(236, 72, 153, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                        color: record.role === 'TRAINER' ? '#ec4899' : '#3b82f6',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                   }}>
                       {record.firstName?.[0]}
                   </div>
                   <div>
                       <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--db-text-primary)' }}>{record.firstName} {record.lastName}</div>
                       <div style={{ fontSize: '0.75rem', color: 'var(--db-text-secondary)' }}>{record.email?.split('@')[0]}</div>
                   </div>
                </div>

                <div className="attendance-record-role" style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 750, color: 'var(--db-text-secondary)', textTransform: 'uppercase' }}>{record.role}</span>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <span style={{ color: record.status === 'PRESENT' ? '#10b981' : '#ef4444', fontSize: '0.8rem', fontWeight: 800 }}>
                        {record.status}
                    </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                   <Switch 
                     size="small" 
                     checked={record.status === 'PRESENT'} 
                     onChange={() => handleStatusToggle(record)}
                     color="success"
                   />
                </div>
            </div>
          ))
        )}
      </div>

      {fetchError && (
        <div style={{ marginTop: '1rem', color: '#f87171', fontSize: '0.85rem', textAlign: 'center' }}>
          {fetchError}
        </div>
      )}
    </div>
  );
};

export default AdminAttendancePage;
