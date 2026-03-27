import React, { useState, useEffect } from "react";
import {
  People,
  FitnessCenter,
  EventNote,
  TrendingUp,
  DirectionsRun,
  CheckCircle,
  Business,
  AssignmentInd,
  Close,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { userApi } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import '../styles/dashboard.css';



const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await userApi.get("/admin/dashboard/18");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const fetchProfile = async () => {
    setProfileLoading(true);
    try {
      const response = await userApi.get("/admin/profile");
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setProfileLoading(false);
    }
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
    if (!profileOpen) fetchProfile();
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-content-inner">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>Welcome back, {user?.fullName || 'Admin'}! 👋</h2>
        <p style={{ margin: 0, color: 'var(--db-text-secondary)', fontSize: '0.9rem' }}>
          Your gym ecosystem is performing optimally. Here's your real-time pulse.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <div className="db-card kpi-card" style={{ '--card-bg-solid': 'rgba(211, 47, 47, var(--card-bg-opacity))' }}>
          <div className="kpi-header">
            <div className="kpi-icon-box" style={{ color: 'var(--db-accent)', backgroundColor: 'rgba(211, 47, 47, 0.25)' }}>
              <People />
            </div>
            <div className="kpi-trend" style={{ color: 'var(--db-green)' }}>
              +12.5%
            </div>
          </div>
          <div className="kpi-label">Total Members</div>
          <div className="kpi-value">{dashboardData?.totalMembers || 0}</div>
        </div>

        <div className="db-card kpi-card" style={{ '--card-bg-solid': 'rgba(46, 125, 50, var(--card-bg-opacity))' }}>
          <div className="kpi-header">
            <div className="kpi-icon-box" style={{ color: 'var(--db-green)', backgroundColor: 'rgba(46, 125, 50, 0.25)' }}>
              <CheckCircle />
            </div>
            <div className="kpi-trend" style={{ color: 'var(--db-green)' }}>
              +5.2%
            </div>
          </div>
          <div className="kpi-label">Active Plans</div>
          <div className="kpi-value">{dashboardData?.activeMembers || 0}</div>
        </div>

        <div className="db-card kpi-card" style={{ '--card-bg-solid': 'rgba(25, 118, 210, var(--card-bg-opacity))' }}>
          <div className="kpi-header">
            <div className="kpi-icon-box" style={{ color: 'var(--db-blue)', backgroundColor: 'rgba(25, 118, 210, 0.25)' }}>
              <FitnessCenter />
            </div>
            <div className="kpi-trend" style={{ color: 'var(--db-text-secondary)' }}>
              0%
            </div>
          </div>
          <div className="kpi-label">Certified Trainers</div>
          <div className="kpi-value">{dashboardData?.totalTrainers || 0}</div>
        </div>

        <div className="db-card kpi-card" style={{ '--card-bg-solid': 'rgba(249, 168, 37, var(--card-bg-opacity))' }}>
          <div className="kpi-header">
            <div className="kpi-icon-box" style={{ color: 'var(--db-yellow)', backgroundColor: 'rgba(249, 168, 37, 0.25)' }}>
              <DirectionsRun />
            </div>
            <div className="kpi-trend" style={{ color: 'var(--db-green)' }}>
              +18%
            </div>
          </div>
          <div className="kpi-label">Daily Check-ins</div>
          <div className="kpi-value">{dashboardData?.trainersPresentToday || 0}</div>
        </div>
      </div>

      {/* Quick Actions Only */}
      <div className="analytics-grid" style={{ display: 'block', gridTemplateColumns: 'none' }}>
        <div>
          <h3 style={{ margin: '0 0 1.5rem 0' }}>Management Hub</h3>
          <div className="actions-grid">
            {[
              { title: "Gym Locations", desc: "Manage branches & facilities", icon: Business, color: "#4dabf7", shadow: "rgba(77, 171, 247, 0.4)", bg: "rgba(77, 171, 247, var(--widget-bg-opacity))", path: "/admin/gyms" },
              { title: "Trainers", desc: "Schedules & staff performance", icon: FitnessCenter, color: "#ff6b6b", shadow: "rgba(255, 107, 107, 0.4)", bg: "rgba(255, 107, 107, var(--widget-bg-opacity))", path: "/admin/trainers/add" },
              { title: "Member Base", desc: "Registration & payment plans", icon: People, color: "#51cf66", shadow: "rgba(81, 207, 102, 0.4)", bg: "rgba(81, 207, 102, var(--widget-bg-opacity))", path: "/admin/members/add" },
              { title: "Attendance", desc: "Live check-in & access logs", icon: EventNote, color: "#fcc419", shadow: "rgba(252, 196, 25, 0.4)", bg: "rgba(252, 196, 25, var(--widget-bg-opacity))", path: "/admin/attendance" },
              { title: "Allocations", desc: "Assign members to trainers", icon: AssignmentInd, color: "#ff5252", shadow: "rgba(255, 82, 82, 0.4)", bg: "rgba(255, 82, 82, var(--widget-bg-opacity))", path: "/admin/assignments" },
            ].map((item, i) => (
              <div 
                key={i} 
                className="nav-widget" 
                style={{ 
                  '--widget-color': item.color,
                  '--widget-shadow': item.shadow,
                  '--widget-bg-custom': item.bg,
                  '--widget-bg-hover': item.bg.replace('var(--widget-bg-opacity)', '0.45')
                }} 
                onClick={() => navigate(item.path)}
              >
                <div className="widget-icon" style={{ backgroundColor: item.color }}>
                  <item.icon style={{ fontSize: '1.8rem' }} />
                </div>
                <div>
                  <div className="widget-title">{item.title}</div>
                  <div className="widget-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Profile Modal */}
      {profileOpen && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          backgroundColor: 'rgba(0,0,0,0.8)', 
          backdropFilter: 'blur(8px)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 1000 
        }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="db-card" 
            style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <h3 style={{ margin: 0 }}>Account Details</h3>
              <Close style={{ cursor: 'pointer' }} onClick={() => setProfileOpen(false)} />
            </div>
            
            {profileLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                <div className="spinner"></div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '20px', 
                    background: 'rgba(255, 107, 107, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 800
                  }}>
                    {profileData?.firstName?.[0] || 'A'}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{profileData?.fullName}</div>
                    <div style={{ color: 'var(--db-accent)', fontWeight: 700, fontSize: '0.8rem' }}>SYSTEM ADMINISTRATOR</div>
                  </div>
                </div>
                
                <hr style={{ border: 'none', borderTop: '1px solid var(--db-border)', margin: 0 }} />
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--db-text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Email</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{profileData?.email}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--db-text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Phone</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{profileData?.phoneNumber}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--db-text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Username</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{profileData?.username}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--db-text-secondary)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Access</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--db-green)' }}>ELEVATED</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
