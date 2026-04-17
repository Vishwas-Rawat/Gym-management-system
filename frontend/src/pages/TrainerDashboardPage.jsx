import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useMemberRegistration } from '../context/MemberRegistrationContext';
import { useWorkout } from '../context/WorkoutContext';
// Chat imports removed
import { useTheme } from '../context/ThemeContext';

import WorkoutPlanView from '../components/WorkoutPlanView';
import AssignWorkoutForm from '../components/AssignWorkoutForm';
import AssignDietForm from '../components/AssignDietForm';
import MemberAddForm from '../components/MemberAddForm';
import DietPlanView from '../components/DietPlanView';
import AttendanceView from '../components/AttendanceView';

import { 
    getMyStats, 
    getMyMembers,
    getDietRequests, 
    getWorkoutRequests,
    updateDietRequestStatus,
    updateWorkoutRequestStatus
} from '../services/trainerDashboardService';
import { getMemberDietPlan, assignDietPlan } from '../services/dietService';
import { workoutService } from '../services/workoutService';
import { authService } from '../services/authService';

import '../styles/dashboard.css';

// --- CUSTOM SVG ICONS (Subset needed for dashboard content) ---
const IconPeople = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);

const IconFitness = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M6 8H5a4 4 0 0 0 0 8h1"></path><line x1="8" y1="12" x2="16" y2="12"></line><line x1="8" y1="8" x2="8" y2="16"></line><line x1="16" y1="8" x2="16" y2="16"></line>
    </svg>
);

const IconDiet = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 3.5a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5v-14A1.5 1.5 0 0 1 6 3.5h12z"></path><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
);

const IconBell = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
);

const IconTrend = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>
    </svg>
);

const IconChat = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

const IconDashboard = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>
    </svg>
);

const IconArrowBack = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

const IconChevronRight = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);

const IconCheck = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const IconClose = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const IconStar = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);


// --- COMPONENTS ---

const DashboardStatCard = ({ title, value, icon, color, subtitle, trend }) => (
    <div className="db-card kpi-card" style={{ '--card-bg-solid': `rgba(${color}, var(--card-bg-opacity))` }}>
        <div className="kpi-header">
            <div className="kpi-icon-box" style={{ color: `rgb(${color})`, backgroundColor: `rgba(${color}, 0.25)` }}>
                {icon}
            </div>
            {trend && <div className="kpi-trend" style={{ color: 'var(--db-green)' }}>{trend}</div>}
        </div>
        <div className="kpi-label">{title}</div>
        <div className="kpi-value">{value}</div>
        {subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--db-text-secondary)', marginTop: '0.5rem' }}>{subtitle}</div>}
    </div>
);

const MemberListCard = ({ member, onClick }) => (
    <div 
        onClick={onClick}
        className="db-card member-premium-card"
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '1.25rem', borderRadius: '20px' }}
    >
        <div className="user-avatar" style={{ 
            width: '56px', height: '56px', border: 'none',
            background: 'linear-gradient(135deg, var(--db-green), #2db44d, #1e9238)', 
            color: '#fff', marginRight: '1.25rem', fontWeight: 800, fontSize: '1.4rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.3s ease'
        }}>
            {member.fullName?.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: 'var(--db-text-primary)', marginBottom: '0.2rem', fontSize: '1.05rem' }}>{member.fullName}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--db-text-secondary)', opacity: 0.8 }}>{member.email}</div>
        </div>
        <div className="select-indicator">
            <IconChevronRight size={18} />
        </div>
    </div>
);

const ManagementHub = ({ onNavigate, onAction }) => (
    <div className="analytics-grid" style={{ marginBottom: '2rem' }}>
        <div className="nav-widget" onClick={() => onNavigate('dashboard')} style={{ '--widget-color': 'var(--db-blue)', '--widget-bg-custom': 'rgba(77, 171, 247, 0.08)' }}>
             <div className="widget-icon" style={{ backgroundColor: 'var(--db-blue)' }}><IconDashboard /></div>
             <div>
                <div className="widget-title">Overview</div>
                <div className="widget-desc">Metrics & Active Members</div>
             </div>
        </div>

        <div className="nav-widget" onClick={() => onAction('DIET_MANAGEMENT')} style={{ '--widget-color': 'var(--db-yellow)', '--widget-bg-custom': 'rgba(252, 196, 25, 0.08)' }}>
             <div className="widget-icon" style={{ backgroundColor: 'var(--db-yellow)' }}><IconDiet /></div>
             <div>
                <div className="widget-title">Diet Management</div>
                <div className="widget-desc">Plans, Logs & Assignments</div>
             </div>
        </div>

        <div className="nav-widget" onClick={() => onAction('WORKOUT_MANAGEMENT')} style={{ '--widget-color': 'var(--db-accent)', '--widget-bg-custom': 'rgba(255, 107, 107, 0.08)' }}>
             <div className="widget-icon" style={{ backgroundColor: 'var(--db-accent)' }}><IconFitness /></div>
             <div>
                <div className="widget-title">Workout Management</div>
                <div className="widget-desc">Routines & Exercises</div>
             </div>
        </div>

        <div className="nav-widget" onClick={() => onNavigate('members')} style={{ '--widget-color': 'var(--db-green)', '--widget-bg-custom': 'rgba(81, 207, 102, 0.08)' }}>
             <div className="widget-icon" style={{ backgroundColor: 'var(--db-green)' }}><IconPeople /></div>
             <div>
                <div className="widget-title">Members</div>
                <div className="widget-desc">Profiles & Attendance</div>
             </div>
        </div>

        {/* Updated to navigate to chat */}
        <div className="nav-widget" onClick={() => onNavigate('chat')} style={{ '--widget-color': 'var(--db-purple)', '--widget-bg-custom': 'rgba(132, 94, 247, 0.08)' }}>
             <div className="widget-icon" style={{ backgroundColor: 'var(--db-purple)' }}><IconChat /></div>
             <div>
                <div className="widget-title">Communication</div>
                <div className="widget-desc">Live Chat & Broadcasts</div>
             </div>
        </div>

        <div className="nav-widget" onClick={() => onNavigate('requests')} style={{ '--widget-color': '#ff922b', '--widget-bg-custom': 'rgba(255, 146, 43, 0.08)' }}>
             <div className="widget-icon" style={{ backgroundColor: '#ff922b' }}><IconBell /></div>
             <div>
                <div className="widget-title">Requests</div>
                <div className="widget-desc">Approve Plans & Changes</div>
             </div>
        </div>
    </div>
);

const DashboardStats = ({ onSelectMember, onNavigate, onAction }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const s = await getMyStats();
                setStats(s);
            } catch (err) {
                console.error("Failed to load dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    if (loading) return <div className="loading-overlay"><div className="spinner"></div></div>;
    
    return (
        <div>
            <div className="kpi-grid">
                <DashboardStatCard 
                    title="Total Members" 
                    value={stats?.totalMembers || 0} 
                    icon={<IconPeople />} 
                    color="77, 171, 247" 
                    subtitle={`${stats?.activeToday || 0} active today`}
                />
                <DashboardStatCard 
                    title="Monthly Earnings" 
                    value={`₹${(stats?.totalEarningsThisMonth || 0).toLocaleString()}`} 
                    icon={<IconTrend />} 
                    color="81, 207, 102" 
                    trend="+12%"
                />
                <DashboardStatCard 
                    title="Active Requests" 
                    value={stats?.pendingDietRequests || 0} 
                    icon={<IconBell />} 
                    color="252, 196, 25" 
                />
                <DashboardStatCard 
                    title="Average Rating" 
                    value={stats?.rating || 4.8} 
                    icon={<IconStar />} 
                    color="132, 94, 247" 
                />
            </div>

            <ManagementHub onNavigate={onNavigate} onAction={onAction} />
        </div>
    );
};

// Removed ChatInterface component

const MemberDetailView = ({ member, onBack }) => {
    const [workoutPlan, setWorkoutPlan] = useState(null);
    const [dietPlan, setDietPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('workout');

    useEffect(() => {
        const fetchPlans = async () => {
            const memberId = member.memberId || member.id;
            if (!memberId) return;
            
            setLoading(true);
            try {
                const [wData, dData] = await Promise.all([
                    workoutService.getMemberWorkoutPlan(memberId).catch(() => null),
                    getMemberDietPlan(memberId).catch(() => null)
                ]);
                setWorkoutPlan(wData);
                setDietPlan(dData);
            } catch (err) {
                console.error("Failed to load member plans", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, [member]);

    const tabs = [
        { id: 'workout', label: 'Workout Plan', icon: <IconFitness size={16} /> },
        { id: 'diet', label: 'Diet Plan', icon: <IconDiet size={16} /> }
    ];

    return (
        <div className="member-detail-page">
            <header style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
                <button 
                    onClick={onBack} 
                    className="db-btn db-btn-outline"
                    style={{ border: 'none', paddingLeft: 0, color: 'var(--db-green)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <IconArrowBack size={18} /> <span>Directory</span>
                </button>
            </header>
            
            <div className="db-card member-profile-header" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '2rem', background: 'var(--db-card)', border: '1px solid var(--db-border)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                <div className="user-avatar" style={{ 
                    width: '90px', height: '90px', borderRadius: '28px', 
                    background: 'var(--db-green)', 
                    color: '#fff', fontSize: '2.8rem', fontWeight: 900, border: '4px solid rgba(255,255,255,0.05)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 10px 25px rgba(81, 207, 102, 0.2)',
                    margin: '0 auto' 
                }}>
                    {member.fullName?.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>{member.fullName}</h2>
                        <span style={{ background: 'rgba(81, 207, 102, 0.1)', color: 'var(--db-green)', padding: '2px 8px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--db-text-secondary)', fontWeight: 600, fontSize: '0.8rem', flexWrap: 'wrap' }}>
                        <span>{member.email}</span>
                        <span>{member.phoneNo}</span>
                        <span>Goal: <span style={{ color: 'var(--db-text-primary)' }}>Muscle Gain</span></span>
                    </div>
                </div>
            </div>

            <div className="detail-tabs">
                {tabs.map(tab => (
                    <div 
                        key={tab.id}
                        className={`detail-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {tab.icon} {tab.label}
                        </div>
                    </div>
                ))}
            </div>
 
            {/* Removed grid layout that held chat, now full width */}
            <div className="detail-content-area" style={{ minHeight: '600px', width: '100%' }}>
                <AnimatePresence mode="wait">

                    {activeTab === 'workout' && (
                        <motion.div 
                            key="workout"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div className="plan-scroll-container">
                                {loading ? (
                                    <div style={{ padding: '5rem', textAlign: 'center' }}>
                                        <div className="db-spinner"></div>
                                        <p style={{ marginTop: '1rem', color: 'var(--db-text-secondary)' }}>Gathering regime details...</p>
                                    </div>
                                ) : (
                                    <WorkoutPlanView plan={workoutPlan} />
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'diet' && (
                        <motion.div 
                            key="diet"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div className="plan-scroll-container">
                                {loading ? (
                                    <div style={{ padding: '5rem', textAlign: 'center' }}>
                                        <div className="db-spinner"></div>
                                        <p style={{ marginTop: '1rem', color: 'var(--db-text-secondary)' }}>Calculating nutrition data...</p>
                                    </div>
                                ) : (
                                    <DietPlanView plan={dietPlan} />
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const RequestsView = ({ onCreatePlan, onUpdateStatus, refreshTrigger }) => {
    const [dietRequests, setDietRequests] = useState([]);
    const [workoutRequests, setWorkoutRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const [dReqs, wReqs] = await Promise.all([
                getDietRequests(),
                getWorkoutRequests()
            ]);
            setDietRequests(dReqs || []);
            setWorkoutRequests(wReqs || []);
        } catch (err) {
            console.error("Failed to load requests", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, [refreshTrigger]);

    const handleStatusAction = async (requestId, type, status) => {
         await onUpdateStatus(requestId, type, status);
         loadRequests();
    };

    if (loading) return <div className="loading-overlay"><div className="spinner"></div></div>;

    const RequestCard = ({ req, type, icon }) => {
        const isPending = !req.status || req.status === 'PENDING';
        const isAccepted = req.status === 'ACCEPTED';
        if (req.status === 'REJECTED') return null;

        return (
            <div className="db-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderLeft: `4px solid ${type === 'Diet' ? 'var(--db-yellow)' : 'var(--db-accent)'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ padding: '0.8rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.03)', color: type === 'Diet' ? 'var(--db-yellow)' : 'var(--db-accent)' }}>
                        {icon}
                    </div>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '1rem' }}>{req.memberName || 'Unknown Member'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--db-text-secondary)', marginTop: '0.2rem' }}>Requested {type} Plan</div>
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {isPending && (
                        <>
                            <button 
                                className="db-btn-icon" 
                                title="Accept"
                                style={{ color: 'var(--db-green)', backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
                                onClick={() => handleStatusAction(req.requestId || req.id, type, 'ACCEPTED')}
                            >
                                <IconCheck size={18} />
                            </button>
                            <button 
                                className="db-btn-icon" 
                                title="Reject"
                                style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                                onClick={() => handleStatusAction(req.requestId || req.id, type, 'REJECTED')}
                            >
                                <IconClose size={18} />
                            </button>
                        </>
                    )}

                    {isAccepted && (
                        <button className="db-btn db-btn-primary" style={{ background: 'var(--db-green)' }} onClick={() => onCreatePlan(req, type)}>
                            Create Plan
                        </button>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="analytics-grid">
            <div>
                <h3 style={{ marginBottom: '1.5rem' }}>Diet Requests</h3>
                {dietRequests.length === 0 ? <div className="db-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--db-text-secondary)' }}>No active diet requests</div> : 
                    dietRequests.map((r, i) => <RequestCard key={i} req={{...r, memberName: r.memberName || r.gymMember?.firstName}} type="Diet" icon={<IconDiet />} />)}
            </div>
            <div>
                <h3 style={{ marginBottom: '1.5rem' }}>Workout Requests</h3>
                {workoutRequests.length === 0 ? <div className="db-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--db-text-secondary)' }}>No active workout requests</div> : 
                    workoutRequests.map((r, i) => <RequestCard key={i} req={{...r, memberName: r.memberName || r.gymMember?.firstName}} type="Workout" icon={<IconFitness />} />)}
            </div>
        </div>
    );
};

const TrainerDashboardPage = () => {
    // Removed useAuth here as it might not be needed if Layout handles header/logout, 
    // but dashboard logic might still need user info for some reason, though stats/requests fetch it mostly.
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [selectedMember, setSelectedMember] = useState(() => {
        const id = searchParams.get('selectedMemberId');
        const name = searchParams.get('selectedMemberName');
        return id ? { id, memberId: id, fullName: name } : null;
    });

    const [activeActionModal, setActiveActionModal] = useState(null); 
    const [assignmentMember, setAssignmentMember] = useState(() => {
        const id = searchParams.get('memberId');
        const name = searchParams.get('memberName');
        return id ? { id, memberId: id, fullName: name } : null;
    });
    const [requestsTimestamp, setRequestsTimestamp] = useState(Date.now());

    const currentView = searchParams.get('tab') || 'dashboard';

    const setCurrentView = (viewId) => {
        if (viewId === 'chat') {
            navigate('/trainer/chat');
            return;
        }

        const newParams = { tab: viewId };
        // Carry over member info if we are in form views
        if (assignmentMember && (viewId.includes('form') || viewId.includes('select'))) {
            newParams.memberId = assignmentMember.memberId || assignmentMember.id;
            newParams.memberName = assignmentMember.fullName;
        }
        // Carry over selected member info if viewing details
        if (selectedMember && (viewId === 'dashboard' || viewId === 'members')) {
            newParams.selectedMemberId = selectedMember.memberId || selectedMember.id;
            newParams.selectedMemberName = selectedMember.fullName;
        }
        setSearchParams(newParams);
    };

    const handleCloseModal = () => setActiveActionModal(null);
    const handleMemberSelectForAssign = (member) => { 
        const mId = member.memberId || member.id;
        setAssignmentMember(member); 
        const nextView = currentView === 'assign-diet-select' ? 'assign-diet-form' : 'assign-workout-form';
        setSearchParams({ tab: nextView, memberId: mId, memberName: member.fullName });
    };
    
    const handleCreatePlanFromRequest = (request, type) => {
        const mId = request.memberId || request.gymMember?.id || request.id;
        const mName = request.memberName || request.gymMember?.firstName;
        const memberData = {
            memberId: mId,
            fullName: mName,
            requestId: request.requestId || request.id,
            requestType: type
        };
        setAssignmentMember(memberData);
        const nextView = type === 'Diet' ? 'assign-diet-form' : 'assign-workout-form';
        setSearchParams({ tab: nextView, memberId: mId, memberName: mName });
    };

    const handleRequestStatusUpdate = async (requestId, type, status) => {
        try {
            if (type === 'Diet') await updateDietRequestStatus(requestId, status);
            else await updateWorkoutRequestStatus(requestId, status);
            setRequestsTimestamp(Date.now());
        } catch (err) { console.error(err); }
    };

    const MemberListView = ({ onSelectMember }) => {
        const [members, setMembers] = useState([]);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const loadMembers = async () => {
                try {
                    // 1. Get Gym ID from Stats
                    const stats = await getMyStats();
                    if (stats && stats.gymId) {
                        // 2. Get Members for this Gym
                        const data = await getMyMembers(stats.gymId);
                        setMembers(data || []);
                    } else {
                         console.warn("Could not retrieve Gym ID from stats");
                         // Fallback or empty state
                    }
                } catch (err) {
                    console.error("Failed to load members", err);
                } finally {
                    setLoading(false);
                }
            };
            loadMembers();
        }, []);

        if (loading) return <div className="loading-overlay"><div className="spinner"></div></div>;

        return (
            <div className="actions-grid">
                {members.length > 0 ? (
                    members.map(m => <MemberListCard key={m.memberId || m.id} member={m} onClick={() => onSelectMember(m)} />)
                ) : (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--db-text-secondary)' }}>
                        No members assigned yet.
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{ position: 'relative' }}>
            {activeActionModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
                     <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="db-card" style={{ width: '90%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '0', borderRadius: '24px' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--db-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: 'var(--db-card)', zIndex: 10 }}>
                            <h3 style={{ margin: 0 }}>{activeActionModal === 'ADD' ? "Register New Member" : "Action Menu"}</h3>
                            <button className="db-btn-icon" onClick={handleCloseModal}><IconClose /></button>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            {activeActionModal === 'ADD' && <MemberAddForm onSuccess={handleCloseModal} onCancel={handleCloseModal} />}
                        </div>
                     </motion.div>
                </div>
            )}

            <AnimatePresence mode="wait">
                <motion.div 
                    key={currentView} 
                    initial={{ opacity: 0, y: 30, scale: 0.98 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: -20, scale: 0.95 }} 
                    transition={{ duration: 0.2, ease: "easeOut" }}
                >
                    {currentView === 'dashboard' && (selectedMember ? <MemberDetailView member={selectedMember} onBack={() => setSelectedMember(null)} /> : 
                        <DashboardStats onSelectMember={setSelectedMember} onNavigate={setCurrentView} onAction={(a) => { if(a==='WORKOUT_MANAGEMENT') setCurrentView('assign-workout-select'); if(a==='DIET_MANAGEMENT') setCurrentView('assign-diet-select'); }} />)}
                    
                    {currentView === 'members' && (selectedMember ? <MemberDetailView member={selectedMember} onBack={() => setSelectedMember(null)} /> : <MemberListView onSelectMember={setSelectedMember} />)}
                    
                    {currentView === 'requests' && <RequestsView onCreatePlan={handleCreatePlanFromRequest} onUpdateStatus={handleRequestStatusUpdate} refreshTrigger={requestsTimestamp} />}
                    
                    {(currentView === 'assign-diet-select' || currentView === 'diet') && (
                        <div className="attendance-container" style={{ padding: 0 }}>
                            <div className="attendance-header" style={{ marginBottom: '2.5rem' }}>
                                <div>
                                    <h1 className="attendance-title" style={{ fontSize: '1.5rem' }}>Select Member</h1>
                                    <p className="attendance-subtitle" style={{ fontSize: '0.85rem' }}>Choose a member to assign a new diet plan</p>
                                </div>
                                <button onClick={() => setCurrentView('dashboard')} className="history-btn" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                    <IconArrowBack size={18} /> Back to Dashboard
                                </button>
                            </div>
                            <MemberListView onSelectMember={handleMemberSelectForAssign} />
                        </div>
                    )}
                                            
                    {currentView === 'assign-diet-form' && assignmentMember && (
                        <div className="attendance-container" style={{ padding: 0 }}>
                            <div className="attendance-header" style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.8rem 1.25rem', borderRadius: '16px', border: '1px solid var(--db-border)' }}>
                                <p className="attendance-subtitle" style={{ margin: 0, fontSize: '0.9rem', color: 'var(--db-text-secondary)' }}>Assigning nutrition for <strong>{assignmentMember.fullName}</strong></p>
                                <button onClick={() => setCurrentView('diet')} className="history-btn" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', height: 'auto' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                                        <IconArrowBack size={14} /> Change Member
                                    </div>
                                </button>
                            </div>
                            <div className="db-card-form-wrapper">
                                <AssignDietForm 
                                    memberId={Number(assignmentMember.memberId || assignmentMember.id)} 
                                    onSubmit={async (data) => { 
                                        await assignDietPlan(data); 
                                        alert("Diet Plan Assigned!"); 
                                        setAssignmentMember(null); 
                                        setCurrentView('dashboard'); 
                                        setRequestsTimestamp(Date.now());
                                    }} 
                                    onCancel={() => { 
                                        setAssignmentMember(null); 
                                        setSearchParams({ tab: 'dashboard' }); 
                                    }} 
                                />
                            </div>
                        </div>
                    )}

                    {(currentView === 'assign-workout-select' || currentView === 'workouts') && (
                        <div className="attendance-container" style={{ padding: 0 }}>
                            <div className="attendance-header" style={{ marginBottom: '2.5rem' }}>
                                <div>
                                    <h1 className="attendance-title" style={{ fontSize: '1.5rem' }}>Select Member</h1>
                                    <p className="attendance-subtitle" style={{ fontSize: '0.85rem' }}>Choose a member to assign a new workout plan</p>
                                </div>
                                <button onClick={() => setCurrentView('dashboard')} className="history-btn" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                    <IconArrowBack size={18} /> Back to Dashboard
                                </button>
                            </div>
                            <MemberListView onSelectMember={handleMemberSelectForAssign} />
                        </div>
                    )}

                    {currentView === 'assign-workout-form' && assignmentMember && (
                        <div className="attendance-container" style={{ padding: 0 }}>
                                <div className="attendance-header" style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.8rem 1.25rem', borderRadius: '16px', border: '1px solid var(--db-border)' }}>
                                <p className="attendance-subtitle" style={{ margin: 0, fontSize: '0.9rem', color: 'var(--db-text-secondary)' }}>Building regime for <strong>{assignmentMember.fullName}</strong></p>
                                <button onClick={() => setCurrentView('workouts')} className="history-btn" style={{ background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', height: 'auto' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                                        <IconArrowBack size={14} /> Change Member
                                    </div>
                                </button>
                            </div>
                            <div className="db-card-form-wrapper">
                                <AssignWorkoutForm 
                                    memberId={Number(assignmentMember.memberId || assignmentMember.id)} 
                                    onSuccess={async (data) => { 
                                        await workoutService.assignWorkout(data); 
                                        alert("Workout Assigned!"); 
                                        setAssignmentMember(null); 
                                        setCurrentView('dashboard'); 
                                        setRequestsTimestamp(Date.now());
                                    }} 
                                    onCancel={() => { 
                                        setAssignmentMember(null); 
                                        setSearchParams({ tab: 'dashboard' }); 
                                    }} 
                                />
                            </div>
                        </div>
                    )}

                    {currentView === 'settings' && (
                        <div className="analytics-grid">
                            <div className="db-card" style={{ padding: '2rem', textAlign: 'center' }}>
                                <div style={{ marginBottom: '1rem', color: 'var(--db-text-secondary)' }}>
                                    <IconDashboard size={48} />
                                </div>
                                <h2>Account Settings</h2>
                                <p style={{ color: 'var(--db-text-secondary)' }}>Profile management and application settings coming soon.</p>
                            </div>
                        </div>
                    )}

                    {currentView === 'attendance' && <AttendanceView />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default TrainerDashboardPage;
