import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/dashboard.css';
// Custom SVG Icon Components (Lucide-inspired)
const Icons = {
  Dashboard: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="11" width="7" height="10" /><rect x="3" y="15" width="7" height="6" />
    </svg>
  ),
  Gyms: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="10" width="20" height="12" rx="2" /><path d="M6 10V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6" />
    </svg>
  ),
  Members: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Trainers: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6.5 6.5 11 11" /><path d="m21 21-1-1" /><path d="m3 3 1 1" /><path d="m18 22 .44-.44a3.3 3.3 0 0 0 0-4.67L17 15.5l-1.5 1.5 1.39 1.39a3.3 3.3 0 0 1 0 4.67l.44.44Z" /><path d="M7 8.5 5.61 7.11a3.3 3.3 0 0 1 0-4.67L6 2l1.5 1.5-1.39 1.39a3.3 3.3 0 0 0 0 4.67l.44.44Z" /><path d="m21 2-1 1" /><path d="m3 22 1-1" /><path d="m18 2 .44.44a3.3 3.3 0 0 1 0 4.67L17 8.5l-1.5-1.5 1.39-1.39a3.3 3.3 0 0 0 0-4.67L17.33 1Z" /><path d="m7 15.5-1.39 1.39a3.3 3.3 0 0 0 0 4.67L6 22l1.5-1.5 1.39-1.39a3.3 3.3 0 0 1 0-4.67L8.5 14.07Z" />
    </svg>
  ),
  Attendance: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Assignments: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" />
    </svg>
  ),
  Logout: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Menu: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  Close: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  LightMode: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  DarkMode: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  Chat: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Profile: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  
  const getActiveId = (path) => {
    if (path.includes('/admin/gyms')) return 1;
    if (path.includes('/admin/members')) return 2;
    if (path.includes('/admin/trainers')) return 3;
    if (path.includes('/admin/attendance')) return 4;
    if (path.includes('/admin/assignments')) return 5;
    if (path.includes('/admin/chat')) return 6;
    return 0; // Dashboard
  };

  const [activeId, setActiveId] = useState(getActiveId(location.pathname));

  useEffect(() => {
    setActiveId(getActiveId(location.pathname));
  }, [location.pathname]);

  const menuItems = [
    { text: "Dashboard", icon: <Icons.Dashboard />, path: '/admin/dashboard', id: 0 },
    { text: "Gyms", icon: <Icons.Gyms />, path: '/admin/gyms', id: 1 },
    { text: "Members", icon: <Icons.Members />, path: '/admin/members/add', id: 2 },
    { text: "Trainers", icon: <Icons.Trainers />, path: '/admin/trainers/add', id: 3 },
    { text: "Attendance", icon: <Icons.Attendance />, path: '/admin/attendance', id: 4 },
    { text: "Assignments", icon: <Icons.Assignments />, path: '/admin/assignments', id: 5 },
    { text: "Chat", icon: <Icons.Chat />, path: '/admin/chat', id: 6 },
    { text: "Profile", icon: <Icons.Profile />, path: '/admin/profile', id: 7 }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div className="mobile-backdrop" onClick={closeMobileMenu} />
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarCollapsed && window.innerWidth > 992 ? 'sidebar-collapsed' : ''} ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-inner">
            <Icons.Trainers />
          </div>
          <span style={{ fontWeight: 900, fontSize: '1.2rem', letterSpacing: '1px' }}>
            Gym<span style={{ color: 'var(--db-accent)' }}>Kro</span>
          </span>
          <button className="mobile-close-btn" onClick={closeMobileMenu}>
             <Icons.Close />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-item ${activeId === item.id ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <span className="nav-item-icon">{item.icon}</span>
              <span className="nav-item-text">{item.text}</span>
            </Link>
          ))}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--db-border)' }}>
          <button 
            onClick={handleLogout}
            className="nav-item nav-item-logout" 
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', display: 'flex', alignItems: 'center' }}
          >
            <span className="nav-item-icon"><Icons.Logout /></span>
            <span className="nav-item-text">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* Top Header */}
        <header className="dashboard-header">
          <div className="header-title-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
            <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
               <Icons.Menu />
            </button>
            <div className="header-title" style={{ minWidth: 0 }}>
              <h1 style={{ textTransform: 'uppercase', fontSize: '1.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                {menuItems.find(i => i.id === activeId)?.text || "Admin"}
              </h1>
            </div>
          </div>
          
          <div className="header-user">
            <button 
              onClick={toggleTheme}
              className="db-btn-icon"
              style={{ 
                width: '38px', 
                height: '38px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                borderRadius: '10px', 
                border: '1px solid var(--db-border)', 
                color: 'var(--db-text-primary)' 
              }}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Icons.LightMode /> : <Icons.DarkMode />}
            </button>
            <div className="user-info">
              <span className="user-name" style={{ fontSize: '0.8rem' }}>{user?.fullName?.split(' ')[0] || 'Admin'}</span>
              <span className="user-role" style={{ fontSize: '0.6rem' }}>SYADMIN</span>
            </div>
            <div className="user-avatar" onClick={() => navigate('/admin/dashboard')} style={{ width: '38px', height: '38px', border: '1px solid var(--db-accent)', boxShadow: '0 0 10px rgba(251, 146, 60, 0.2)' }}>
              <div style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '50%', 
                backgroundColor: 'var(--db-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 900,
                fontSize: '0.95rem',
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}>
                {user?.fullName?.[0] || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Content View */}
        <div className="dashboard-content">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
