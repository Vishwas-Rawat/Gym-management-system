import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/dashboard.css';

// Custom SVG Icons
const IconSearch = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const IconClose = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

const AssignMembersDialog = ({ open, onClose, trainer, onAssign }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    if (open && trainer?.gymId) {
      fetchMembers(trainer.gymId);
    }
  }, [open, trainer]);

  const fetchMembers = async (gymId) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/member/gym/${gymId}`);
      setMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (memberId) => {
    setSelectedMemberIds(prev => 
        prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
    );
  };

  const handleAssign = async () => {
    setAssigning(true);
    await onAssign(trainer.trainerId || trainer.id, selectedMemberIds);
    setAssigning(false);
    onClose();
  };

  const filteredMembers = members.filter(m => 
    m.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!open) return null;

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30000 }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="db-card" style={{ width: '450px', padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--db-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>Assign to {trainer?.fullName}</h3>
                <button className="db-btn-icon" onClick={onClose}><IconClose /></button>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
                <div className="db-search-wrapper" style={{ marginBottom: '1.5rem' }}>
                    <IconSearch />
                    <input 
                        className="db-search-input" 
                        placeholder="Search members..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div>
                ) : (
                    <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.1rem', paddingRight: '0.5rem' }}>
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map((member) => {
                                const memberId = member.memberId || member.id;
                                return (
                                    <div 
                                        key={memberId} 
                                        onClick={() => handleToggle(memberId)}
                                        style={{ 
                                            display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', 
                                            borderRadius: '10px', cursor: 'pointer', transition: 'var(--transition)',
                                            backgroundColor: selectedMemberIds.includes(memberId) ? 'rgba(255, 107, 107, 0.05)' : 'transparent'
                                        }}
                                    >
                                        <input type="checkbox" checked={selectedMemberIds.includes(memberId)} readOnly style={{ accentColor: 'var(--db-accent)' }} />
                                        <div className="avatar-sm" style={{ backgroundColor: 'rgba(77, 171, 247, 0.1)', color: 'var(--db-blue)' }}>{member.fullName[0]}</div>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{member.fullName}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--db-text-secondary)' }}>{member.email}</div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div style={{ textAlign: 'center', color: 'var(--db-text-secondary)', padding: '2rem' }}>No members found.</div>
                        )}
                    </div>
                )}
            </div>

            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--db-border)', display: 'flex', gap: '1rem' }}>
                <button className="db-btn db-btn-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
                <button className="db-btn db-btn-primary" style={{ flex: 2 }} onClick={handleAssign} disabled={assigning || selectedMemberIds.length === 0}>
                    {assigning ? 'Assigning...' : `Assign (${selectedMemberIds.length})`}
                </button>
            </div>
        </motion.div>
    </div>,
    document.body
  );
};

export default AssignMembersDialog;
