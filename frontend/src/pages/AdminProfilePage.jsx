
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Person, 
  Email, 
  Phone, 
  LocationOn, 
  Transgender, 
  Cake, 
  FitnessCenter,
  Business,
  AdminPanelSettings,
  Edit
} from '@mui/icons-material';
import { authService } from '../services/authService';
import '../styles/dashboard.css';

const AdminProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getAdminProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setError("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading) return <div className="spinner-container"><div className="spinner"></div></div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!profile) return null;

  // Modern Card Style
  const glassCardStyle = {
    background: 'rgba(30, 41, 59, 0.4)', // Darker glass
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  };

  const labelStyle = {
    color: 'var(--db-text-secondary)',
    fontSize: '0.85rem',
    display: 'flex', 
    alignItems: 'center', 
    gap: '0.5rem',
    marginBottom: '0.25rem'
  };

  const valueStyle = {
    color: 'var(--db-text-primary)',
    fontWeight: 500,
    fontSize: '1rem'
  };

  return (
    <div className="dashboard-content-inner">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile Header Banner */}
        <div className="profile-header-banner">
          {/* Profile Picture */}
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-inner">
              {profile.fullName?.[0] || 'A'}
            </div>
          </div>

          {/* Profile Details */}
          <div className="profile-header-details">
            <h1>{profile.fullName}</h1>
            <div className="profile-header-meta">
                <span className="db-badge" style={{ 
                  background: 'rgba(249, 115, 22, 0.2)', 
                  color: 'var(--db-accent)',
                  border: '1px solid rgba(249, 115, 22, 0.3)'
                }}>
                  ADMIN
                </span>
                <span style={{ color: 'var(--db-text-secondary)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Email style={{ fontSize: '1.1rem' }} /> {profile.email}
                </span>
            </div>
          </div>
        </div>

        <div className="profile-main-grid">
          {/* Left Column - Personal Details */}
          <div className="profile-grid-left">
            <div className="profile-section-card">
              <div className="profile-section-title">
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Person style={{ color: 'var(--db-accent)' }} /> Personal Information
                </h3>
              </div>

              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <div className="profile-info-label"><Phone fontSize="small" /> Phone</div>
                  <div className="profile-info-value">{profile.phoneNo}</div>
                </div>
                <div className="profile-info-item">
                   <div className="profile-info-label"><Cake fontSize="small" /> Date of Birth</div>
                   <div className="profile-info-value">{profile.dateOfBirth || 'Not Set'}</div>
                </div>
                <div className="profile-info-item">
                   <div className="profile-info-label"><Transgender fontSize="small" /> Gender</div>
                   <div className="profile-info-value">{profile.gender || 'Not Set'}</div>
                </div>
                <div className="profile-info-item">
                   <div className="profile-info-label"><LocationOn fontSize="small" /> Location</div>
                   <div className="profile-info-value">{profile.city || profile.address || 'Not Set'}</div>
                </div>
                <div className="profile-info-item" style={{ gridColumn: '1 / -1' }}>
                  <div className="profile-info-label"><LocationOn fontSize="small" /> Full Address</div>
                  <div className="profile-info-value" style={{ lineHeight: 1.5 }}>{profile.address || 'Address not provided'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Gyms */}
          <div className="profile-grid-right">
            <div className="profile-section-card">
              <div className="profile-section-title">
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FitnessCenter style={{ color: 'var(--db-accent)' }} /> Managed Gyms
                </h3>
                <span className="db-badge" style={{ background: 'rgba(249, 115, 22, 0.1)', color: 'var(--db-accent)' }}>
                  {profile.gyms?.length || 0} Total
                </span>
              </div>

              <div className="profile-gym-list">
                {profile.gyms && profile.gyms.length > 0 ? (
                  profile.gyms.map((gym) => (
                    <div key={gym.gymId} className="profile-gym-item">
                      <div style={{ 
                        width: '44px', height: '44px', borderRadius: '12px', 
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(234, 88, 12, 0.1))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--db-accent)',
                        flexShrink: 0
                      }}>
                        <Business fontSize="small" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: 'var(--db-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{gym.gymName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--db-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{gym.city}</div>
                      </div>
                      {gym.isActive && (
                         <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', flexShrink: 0 }}></div>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--db-text-secondary)' }}>
                    No gyms associated.
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};


export default AdminProfilePage;
