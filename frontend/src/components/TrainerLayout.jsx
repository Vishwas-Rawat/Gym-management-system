import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { MemberRegistrationProvider } from '../context/MemberRegistrationContext';
import { WorkoutProvider } from '../context/WorkoutContext';
import { ChatProvider } from '../context/ChatContext';
import '../styles/dashboard.css';

// Reuse existing Icons from TrainerDashboard or define new ones relative to the design
const Icons = {
    Dashboard: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>
        </svg>
    ),
    People: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
    ),
    Bell: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
    ),
    Calendar: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
    ),
    Chat: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
    ),
    Fitness: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M6 8H5a4 4 0 0 0 0 8h1"></path><line x1="8" y1="12" x2="16" y2="12"></line><line x1="8" y1="8" x2="8" y2="16"></line><line x1="16" y1="8" x2="16" y2="16"></line>
        </svg>
    ),
    Dumbbell: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6.5 6.5l11 11"></path><path d="M21 21l-1-1"></path><path d="M3 3l1 1"></path><path d="M18 22l4-4"></path><path d="M2 6l4-4"></path><path d="M3 10l7.5-7.5"></path><path d="M14 21l7.5-7.5"></path>
        </svg>
    ),
    Apple: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
             <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/>
        </svg>
    ),
    Settings: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
    ),
    Logout: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
    ),
    Menu: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
    ),
    Sun: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
    ),
    Moon: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
    ),
    Close: ({ size = 20 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    )
};

const TrainerLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth(); // Assuming 'user' contains profile
    const { isDarkMode, toggleTheme } = useTheme();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Initial check for active tab query param to sync with existing logic if needed
    // But now we prefer route based highlighting
    const getActiveId = (path, search) => {
        if (path === '/trainer/chat') return 'chat';
        if (path === '/trainer/dashboard') {
             const params = new URLSearchParams(search);
             const tab = params.get('tab');
             if (tab === 'members') return 'members';
             if (tab === 'requests') return 'requests';
             if (tab === 'attendance') return 'attendance';
             if (tab === 'workouts') return 'workouts';
             if (tab === 'diet') return 'diet';
             if (tab === 'settings') return 'settings';
             return 'dashboard';
        }
        return 'dashboard';
    };

    const currentView = getActiveId(location.pathname, location.search);

    const handleNavigate = (id) => {
        setIsMobileMenuOpen(false);
        if (id === 'chat') {
            navigate('/trainer/chat');
        } else {
            // For existing single-page logical tabs, we navigate to dashboard with query param
            // unless it's the main dashboard itself
            if (id === 'dashboard') navigate('/trainer/dashboard?tab=dashboard');
            else navigate(`/trainer/dashboard?tab=${id}`);
        }
    };

    const navItems = [
        { id: 'dashboard', icon: <Icons.Dashboard />, label: 'Dashboard' },
        { id: 'members', icon: <Icons.People />, label: 'Members' },
        { id: 'workouts', icon: <Icons.Dumbbell />, label: 'Workouts' },
        { id: 'diet', icon: <Icons.Apple />, label: 'Nutrition' },
        { id: 'requests', icon: <Icons.Bell />, label: 'Requests' },
        { id: 'attendance', icon: <Icons.Calendar />, label: 'Attendance' },
        { id: 'chat', icon: <Icons.Chat />, label: 'Messages' },
        { id: 'settings', icon: <Icons.Settings />, label: 'Settings' },
    ];

    return (
        <MemberRegistrationProvider>
            <WorkoutProvider>
                <ChatProvider>
                    <div className={`dashboard-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${isMobileMenuOpen ? 'mobile-nav-open' : ''}`} style={{ '--db-accent': '#51cf66' }}>
                        {isMobileMenuOpen && (
                            <div 
                                onClick={() => setIsMobileMenuOpen(false)}
                                style={{ position: 'fixed', inset: 0, zIndex: 99, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} 
                            />
                        )}

                        <nav className={`dashboard-sidebar ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
                            <div className="sidebar-logo">
                                <div className="logo-inner" style={{ borderRadius: '12px', background: 'var(--db-green)' }}><Icons.Fitness /></div>
                                <div className="nav-item-text" style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.5px' }}>TrainerPortal</div>
                                <button className="mobile-close-btn" onClick={() => setIsMobileMenuOpen(false)} style={{marginLeft: 'auto', background: 'transparent', border:'none', color: 'white', display: isMobileMenuOpen ? 'block' : 'none'}}>
                                    <Icons.Close />
                                </button>
                            </div>
                            <div className="sidebar-nav">
                                {navItems.map(item => (
                                    <div key={item.id} className={`nav-item ${currentView === item.id ? 'active' : ''}`} onClick={() => handleNavigate(item.id)}>
                                        <div className="nav-item-icon">{item.icon}</div>
                                        <span className="nav-item-text">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ padding: '1rem' }}>
                                <div className="nav-item" onClick={logout} style={{ color: '#ff6b6b' }}>
                                    <div className="nav-item-icon"><Icons.Logout /></div>
                                    <span className="nav-item-text">Logout</span>
                                </div>
                            </div>
                        </nav>

                        <main className="dashboard-main">
                            <header className="dashboard-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
                                    <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)}>
                                        <Icons.Menu />
                                    </button>
                                    <div className="header-title" style={{ minWidth: 0, flex: 1 }}>
                                        <h1 style={{ fontSize: '1.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {currentView === 'dashboard' ? 'Overview' : 
                                             currentView === 'members' ? 'Members' :
                                             currentView === 'requests' ? 'Approval' :
                                             currentView === 'attendance' ? 'Attendance' :
                                             currentView === 'chat' ? 'Messages' :
                                             currentView.split('-')[0].charAt(0).toUpperCase() + currentView.split('-')[0].slice(1)}
                                        </h1>
                                        <p style={{ margin: 0, color: 'var(--db-text-secondary)', fontWeight: 600, fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Welcome, {user?.firstName || 'Trainer'}</p>
                                    </div>
                                </div>
                                <div className="header-user">
                                     <button onClick={toggleTheme} className="theme-toggle" style={{ width: '38px', height: '38px', border: '1px solid var(--db-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', color: isDarkMode ? 'var(--db-yellow)' : 'var(--db-text-secondary)' }}>
                                        <AnimatePresence mode="wait">
                                            <motion.div key={isDarkMode?'s':'m'} initial={{opacity:0, rotate:-45}} animate={{opacity:1, rotate:0}} exit={{opacity:0, rotate:45}} transition={{duration:0.2}}>
                                                {isDarkMode ? <Icons.Sun size={20} /> : <Icons.Moon size={20} />}
                                            </motion.div>
                                        </AnimatePresence>
                                     </button>
                                     <div className="user-info">
                                        <span className="user-name">{user ? `${user.firstName} ${user.lastName}` : 'Trainer'}</span>
                                        <span className="user-role" style={{ color: 'var(--db-green)', letterSpacing: '1px', fontSize: '0.6rem' }}>CERTIFIED</span>
                                     </div>
                                     <div className="user-avatar" style={{ borderColor: 'var(--db-green)', width: '38px', height: '38px', background: 'var(--db-green)', color: '#fff', fontSize: '0.9rem' }}>
                                        {user?.firstName?.charAt(0).toUpperCase() || 'T'}
                                     </div>
                                </div>
                            </header>

                            <div className="dashboard-content">
                                <Outlet />
                            </div>
                        </main>
                    </div>
                </ChatProvider>
            </WorkoutProvider>
        </MemberRegistrationProvider>
    );
};

export default TrainerLayout;
