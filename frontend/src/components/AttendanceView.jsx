import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAttendance } from '../context/AttendanceContext';
import '../styles/dashboard.css';
import '../styles/attendance-view.css';

// --- Custom SVG Icons ---
const Icons = {
    Check: ({ size = 24, color = "currentColor" }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    ),
    Cross: ({ size = 24, color = "currentColor" }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    ),
    History: ({ size = 24, color = "currentColor" }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
    ),
    Fire: ({ size = 24, color = "currentColor" }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-0.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.2-2.2.6-3.2 1.3 2 2.5 2.7 2.9 3.7z"></path>
        </svg>
    ),
    Trophy: ({ size = 24, color = "currentColor" }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
            <path d="M4 22h16"></path>
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
        </svg>
    ),
    Calendar: ({ size = 24, color = "currentColor" }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
    ),
    Close: ({ size = 24, color = "currentColor" }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    )
};

const StatCard = ({ title, value, icon, color, subtext }) => (
    <div className="stat-card">
        <div style={{ position: 'absolute', top: -10, right: -10, opacity: 0.1, color: color }}>
            {icon({ size: 100, color: 'currentColor' })}
        </div>
        
        <div style={{ 
            color: color, 
            marginBottom: '1rem',
            background: `color-mix(in srgb, ${color} 15%, transparent)`,
            borderRadius: '12px',
            padding: '10px',
            display: 'inline-flex'
        }}>
            {icon({ size: 24 })}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>{title}</div>
        <div className="stat-value">{value}</div>
        {subtext && <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{subtext}</div>}
    </div>
);

const HistoryModal = ({ history, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={e => e.stopPropagation()}
            className="modal-content"
        >
            <div className="history-modal-header">
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'inherit', fontSize: '1.25rem' }}>
                    <Icons.History size={20} color="var(--db-blue)" /> Attendance History
                </h3>
                <button onClick={onClose} className="history-close-btn">
                    <Icons.Close size={24} />
                </button>
            </div>
            <div style={{ overflowY: 'auto', padding: '1rem' }}>
                {history && history.length > 0 ? (
                    history.map((rec, i) => {
                        const isPresent = rec.status === 'PRESENT';
                        const isNotMarked = rec.status === 'NOT MARKED';
                        const statusColor = isPresent ? '#22c55e' : (isNotMarked ? '#ef4444' : '#64748b');
                        const statusBg = isPresent ? 'rgba(34, 197, 94, 0.1)' : (isNotMarked ? 'rgba(239, 68, 68, 0.1)' : 'rgba(100, 116, 139, 0.1)');
                        const label = isPresent ? 'Present' : (isNotMarked ? 'Absent' : rec.status);

                        return (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="history-item"
                                style={{ 
                                    borderLeft: `4px solid ${statusColor}`
                                }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span className="history-date">
                                        {new Date(rec.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                    {isPresent && (
                                        <span style={{ fontSize: '0.85rem', color: 'var(--db-text-secondary)' }}>
                                            {new Date(rec.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    )}
                                </div>
                                <span style={{ 
                                    color: statusColor, 
                                    fontWeight: 600,
                                    backgroundColor: statusBg,
                                    padding: '0.5rem 1rem',
                                    borderRadius: '999px',
                                    fontSize: '0.8rem',
                                    letterSpacing: '0.5px'
                                }}>
                                    {label}
                                </span>
                            </motion.div>
                        );
                    })
                ) : (
                    <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>
                        <div style={{ opacity: 0.3, marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                            <Icons.Calendar size={48} />
                        </div>
                        <p style={{ margin: 0 }}>No attendance records found yet.</p>
                    </div>
                )}
            </div>
        </motion.div>
    </div>
);

const AttendanceView = () => {
    const { 
        loading, 
        todayStatus, 
        history, 
        markAttendance, 
        checkTodayAttendance, 
        getAttendanceHistory 
    } = useAttendance();

    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        checkTodayAttendance();
        getAttendanceHistory();
    }, []);

    const { currentStreak, maxStreak, totalPresent } = useMemo(() => {
        if (!history || !Array.isArray(history)) return { currentStreak: 0, maxStreak: 0, totalPresent: 0 };
        
        const sorted = [...history].sort((a, b) => new Date(b) - new Date(a));
        const presentRecords = sorted.filter(r => r.status === 'PRESENT');
        const totalPresent = presentRecords.length;
        const todayStr = new Date().toISOString().split('T')[0];
        const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        let current = 0;
        let lastDate = null;

        for (let rec of presentRecords) {
            const recDate = rec.date.split('T')[0];
            if (lastDate) {
                const diffDays = Math.ceil(Math.abs(new Date(lastDate) - new Date(recDate)) / (1000 * 60 * 60 * 24));
                if (diffDays === 1) { current++; lastDate = recDate; }
                else if (diffDays > 1) break;
            } else {
                 if (recDate === todayStr || recDate === yesterdayStr) { current = 1; lastDate = recDate; }
                 else break;
            }
        }

        let max = 0;
        let temp = 0;
        const ascending = [...history].sort((a, b) => new Date(a) - new Date(b));
        let prevDate = null;
        for (let rec of ascending) {
            if (rec.status !== 'PRESENT') continue;
            const d = rec.date.split('T')[0];
            if (prevDate) {
                const diffDays = Math.ceil(Math.abs(new Date(d) - new Date(prevDate)) / (1000 * 60 * 60 * 24));
                if (diffDays === 1) temp++;
                else { max = Math.max(max, temp); temp = 1; }
            } else temp = 1;
            prevDate = d;
        }
        max = Math.max(max, temp);

        return { currentStreak: current, maxStreak: max || 0, totalPresent };
    }, [history]);

    const handleToggle = async () => {
        await markAttendance();
    };

    return (
        <div className="attendance-container">
            {/* Header */}
            <div className="attendance-header">
                <div>
                    <h1 className="attendance-title">
                        Attendance
                    </h1>
                    <p className="attendance-subtitle">
                        Consistency is the key to progress.
                    </p>
                </div>
                <button 
                    onClick={() => setShowHistory(true)}
                    className="history-btn"
                >
                    <Icons.History size={18} /> View History
                </button>
            </div>

            {/* Main Grid */}
            <div className="attendance-grid">
                
                {/* ACTION CARD */}
                <motion.div 
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="action-card"
                    style={{ 
                        border: todayStatus === 'PRESENT' ? '2px solid #22c55e' : '1px solid #334155',
                        boxShadow: todayStatus === 'PRESENT' ? '0 0 40px -10px rgba(34, 197, 94, 0.3)' : 'none',
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={todayStatus ? 'status' : 'loading'}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', zIndex: 10 }}
                        >
                            <div className="status-icon-circle" style={{
                                background: todayStatus === 'PRESENT' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(15, 23, 42, 0.5)',
                                color: todayStatus === 'PRESENT' ? '#22c55e' : '#64748b'
                            }}>
                                {todayStatus === 'PRESENT' ? (
                                    <Icons.Check size={50} />
                                ) : (
                                    <Icons.Cross size={40} />
                                )}
                            </div>

                            <h2 className={`status-title ${todayStatus === 'PRESENT' ? 'status-text-present' : 'status-text-absent'}`}>
                                {todayStatus === 'PRESENT' ? 'Marked Present' : 'Marked Absent'}
                            </h2>
                            <p className="status-desc">
                                {todayStatus === 'PRESENT' 
                                    ? "You're all set! Enjoy your day at the gym." 
                                    : "You are marked as absent for today."}
                            </p>

                            <button
                                onClick={!loading ? handleToggle : undefined}
                                disabled={loading}
                                className="action-btn"
                                style={{
                                    background: todayStatus === 'PRESENT' ? 'transparent' : '#3b82f6',
                                    color: todayStatus === 'PRESENT' ? '#ef4444' : '#ffffff',
                                    border: todayStatus === 'PRESENT' ? '1px solid #ef4444' : 'none',
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                {loading ? 'Updating...' : (todayStatus === 'PRESENT' ? 'Mark Absent' : 'Mark Present')}
                            </button>

                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* STATS AREA */}
                <div className="stats-column">
                    <div className="stats-row">
                        <StatCard 
                            title="Current Streak" 
                            value={currentStreak} 
                            icon={Icons.Fire} 
                            color="#f59e0b" 
                            subtext="Keep it up!"
                        />
                         <StatCard 
                            title="Best Streak" 
                            value={maxStreak} 
                            icon={Icons.Trophy} 
                            color="#38bdf8" 
                            subtext="Your Record"
                        />
                    </div>

                     <div className="total-checkins-card">
                         <div style={{ position: 'absolute', top: 0, right: 0, opacity: 0.1 }}>
                            <Icons.Check size={200} color="white" />
                         </div>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 600, fontSize: '1.1rem', opacity: 0.9 }}>Total Check-ins</h3>
                            <div className="total-checkins-value">{totalPresent}</div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>days attended since joining</div>
                        </div>
                    </div>
                </div>

            </div>

            <AnimatePresence>
                {showHistory && <HistoryModal history={history} onClose={() => setShowHistory(false)} />}
            </AnimatePresence>
        </div>
    );
};

export default AttendanceView;
