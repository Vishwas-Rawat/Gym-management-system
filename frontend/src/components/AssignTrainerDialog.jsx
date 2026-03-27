import React, { useState, useEffect } from 'react';
import { Person, Close } from '@mui/icons-material';
import { userApi } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/dashboard.css';

const AssignTrainerDialog = ({ open, onClose, gymId, memberId, onAssignSuccess }) => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [assigningId, setAssigningId] = useState(null);

  useEffect(() => {
    if (open && gymId) {
      fetchTrainers();
    }
  }, [open, gymId]);

  const fetchTrainers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await userApi.get(`/trainer/gym/${gymId}`);
      setTrainers(data || []);
    } catch (err) {
      setError("Failed to load trainers.");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (trainerId) => {
    if (!memberId) {
        setError("Invalid Member ID. Please refresh and try again.");
        return;
    }
    setAssigningId(trainerId);
    try {
      await userApi.post('/trainer/admin/assign-members', {
        trainerId,
        memberIds: [memberId]
      });
      if (onAssignSuccess) onAssignSuccess();
      onClose();
    } catch (err) {
      console.error("Assign Error:", err);
      alert("Failed to assign trainer: " + (err.response?.data?.message || err.message));
    } finally {
      setAssigningId(null);
    }
  };

  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="db-card" style={{ width: '400px', padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--db-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>Assign Trainer</h3>
                <button className="db-btn-icon" onClick={onClose}><Close fontSize="small" /></button>
            </div>
            
            <div style={{ padding: '1.5rem', maxHeight: '400px', overflowY: 'auto' }}>
                {error && <div style={{ color: '#ee5253', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}
                
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div>
                ) : trainers.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--db-text-secondary)', padding: '2rem' }}>No trainers found.</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {trainers.map((trainer) => (
                            <div key={trainer.trainerId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div className="avatar-sm" style={{ backgroundColor: 'rgba(132, 94, 247, 0.1)', color: 'var(--db-purple)' }}>{trainer.fullName?.[0] || <Person fontSize="small" />}</div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{trainer.fullName}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--db-text-secondary)' }}>{trainer.specialization || "General"}</div>
                                    </div>
                                </div>
                                <button 
                                    className="db-btn db-btn-primary" 
                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                                    disabled={assigningId === trainer.trainerId}
                                    onClick={() => handleAssign(trainer.trainerId)}
                                >
                                    {assigningId === trainer.trainerId ? "..." : "Assign"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    </div>
  );
};

export default AssignTrainerDialog;
