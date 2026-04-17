import React, { useState, useEffect, useRef, useMemo } from "react";
import AssignmentsCard from "../components/AssignmentsCard";
import { useGym } from "../context/GymContext";
import { motion, AnimatePresence } from "framer-motion";
import '../styles/dashboard.css';

const Icons = {
  MapPin: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  )
};


const AdminAssignmentsPage = () => {
  const { gyms, getMyGyms } = useGym();
  const [selectedGymId, setSelectedGymId] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    getMyGyms();
    
    // Close dropdown on outside click
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (gyms.length > 0 && !selectedGymId) {
      setSelectedGymId(gyms[0].gymId);
    }
  }, [gyms, selectedGymId]); // Added selectedGymId to dependency array for completeness

  const selectedGymName = useMemo(() => {
    return gyms.find(g => g.gymId.toString() === selectedGymId.toString())?.gymName || "Select Gym";
  }, [gyms, selectedGymId]);

  return (
    <div className="dashboard-content-inner">
      {/* Refined Header - Removed sub-label and improved dropdown */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <h2 style={{ margin: 0, fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.5px' }}>
            MANAGE <span style={{ color: 'var(--db-accent)' }}>ASSIGNMENTS</span>
          </h2>
          <p style={{ margin: '0.5rem 0 0 0', color: 'var(--db-text-secondary)', fontSize: '0.9rem', maxWidth: '600px', lineHeight: 1.5 }}>
            Manage and monitor member-trainer relationships across your gyms.
          </p>
        </div>

        {/* Improved Responsive Selector Container */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '450px' }}>
          <div ref={dropdownRef} style={{ width: '100%' }}>
            {/* Custom Dropdown Trigger - Light/Dark Theme Optimized */}
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="glass-panel"
              style={{
                  width: '100%',
                  padding: '1rem 1.25rem',
                  backgroundColor: 'var(--db-sidebar)',
                  border: '1px solid var(--db-border)',
                  borderRadius: '16px',
                  color: 'var(--db-text-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: isDropdownOpen ? '0 0 0 2px rgba(251, 146, 60, 0.2), 0 10px 25px rgba(0,0,0,0.1)' : '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{ color: 'var(--db-accent)', display: 'flex' }}>
                  <Icons.MapPin />
                </div>
                <span style={{ color: selectedGymId ? 'var(--db-text-primary)' : 'var(--db-text-secondary)', opacity: selectedGymId ? 1 : 0.7 }}>
                    {selectedGymId ? selectedGymName : "Select a Location"}
                </span>
              </div>
              <div style={{ 
                  display: 'flex',
                  color: 'var(--db-accent)',
                  transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
              }}>
                <Icons.ChevronDown />
              </div>
            </div>

            {/* Premium Dropdown Menu */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                  style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      left: 0,
                      right: 0,
                      backgroundColor: 'var(--db-card)',
                      backdropFilter: 'blur(25px)',
                      border: '1px solid var(--db-border)',
                      borderRadius: '18px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                      zIndex: 1000,
                      overflow: 'hidden',
                      padding: '0.6rem'
                  }}
                >
                  <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }}>
                    {gyms.map((gym) => (
                      <div 
                          key={gym.gymId}
                          onClick={() => {
                            setSelectedGymId(gym.gymId);
                            setIsDropdownOpen(false);
                          }}
                          style={{
                            padding: '0.9rem 1.1rem',
                            margin: '3px 0',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            backgroundColor: selectedGymId.toString() === gym.gymId.toString() ? 'rgba(251, 146, 60, 0.12)' : 'transparent',
                            color: selectedGymId.toString() === gym.gymId.toString() ? 'var(--db-accent)' : 'var(--db-text-primary)'
                          }}
                          onMouseEnter={(e) => {
                            if (selectedGymId.toString() !== gym.gymId.toString()) {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
                              e.currentTarget.style.transform = 'translateX(4px)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = selectedGymId.toString() === gym.gymId.toString() ? 'rgba(251, 146, 60, 0.12)' : 'transparent';
                            e.currentTarget.style.transform = 'translateX(0)';
                          }}
                      >
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: selectedGymId.toString() === gym.gymId.toString() ? 'var(--db-accent)' : 'var(--db-border)', transition: 'all 0.3s' }} />
                        {gym.gymName}
                      </div>
                    ))}
                  </div>
                  {gyms.length === 0 && <div style={{ padding: '2rem 1rem', textAlign: 'center', opacity: 0.5, fontSize: '0.85rem', fontWeight: 500 }}>No locations discovered</div>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
      
      {selectedGymId && <AssignmentsCard gymId={selectedGymId} />}
    </div>
  );
};

export default AdminAssignmentsPage;
