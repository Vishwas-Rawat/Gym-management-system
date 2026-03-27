import React, { useState, useEffect } from 'react';
import { Search, Person, FitnessCenter, AssignmentInd, Edit, Add, Delete, ExpandMore, Close } from '@mui/icons-material';
import { userApi } from '../services/api';
import AssignTrainerDialog from './AssignTrainerDialog';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/dashboard.css';

const AssignmentsCard = ({ gymId }) => {
    const [tab, setTab] = useState(0); // 0 = Member Based, 1 = Trainer Based
    const [members, setMembers] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [trainerMembersMap, setTrainerMembersMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    
    // For Member-Based Single Assignment
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    
    // For Trainer-Based Bulk Assignment
    const [bulkAssignDialogOpen, setBulkAssignDialogOpen] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [potentialMembers, setPotentialMembers] = useState([]);
    const [selectedMemberIds, setSelectedMemberIds] = useState([]);
    const [assignLoading, setAssignLoading] = useState(false);
    const [expandedTrainers, setExpandedTrainers] = useState({}); 
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchMemberBasedData = async () => {
        if(!gymId) return;
        setLoading(true);
        try {
            // WORKAROUND: The /member/gym/:id endpoint is missing memberId in the response.
            // We fetch ALL members and filter client-side to ensure we get the full member object.
            const response = await userApi.get(`/member/all`); 
            const allMembers = response.data || [];
            
            // Filter by gymId (loose equality to handle string/number mismatch)
            const gymMembers = gymId ? allMembers.filter(m => m.gymId == gymId) : allMembers;
            
            setMembers(gymMembers);
        } catch (err) {
            console.error("Failed to fetch members", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrainerBasedData = async () => {
        if(!gymId) return;
        setLoading(true);
        try {
            const trainersRes = await userApi.get(`/trainer/gym/${gymId}`);
            const trainersData = trainersRes.data || [];
            setTrainers(trainersData);
            const membersMap = {};
            await Promise.all(
                trainersData.map(async (trainer) => {
                    try {
                        const membersRes = await userApi.get(`/trainer/${trainer.trainerId}/members`);
                        membersMap[trainer.trainerId] = membersRes.data || [];
                    } catch (err) {
                        membersMap[trainer.trainerId] = [];
                    }
                })
            );
            setTrainerMembersMap(membersMap);
        } catch (err) {
            console.error("Failed to fetch trainer data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tab === 0) fetchMemberBasedData();
        else fetchTrainerBasedData();
    }, [gymId, tab]);

    const handleBulkAssignClick = async (trainer) => {
        setSelectedTrainer(trainer);
        setAssignLoading(true);
        setBulkAssignDialogOpen(true);
        try {
            const response = await userApi.get(`/trainer/${trainer.trainerId}/potential-members`);
            // console.log("Potential Members:", response.data);
            setPotentialMembers(response.data || []);
            const currentMembers = trainerMembersMap[trainer.trainerId] || [];
            console.log("Current Members for Trainer:", currentMembers);
            
            // ROBUST ID EXTRACTION & FILTERING
            const extractedIds = currentMembers
                .map(m => m.memberId || m.userId || m.id)
                .filter(id => id !== undefined && id !== null);
                
            console.log("Extracted IDs for Initial Selection:", extractedIds);
            setSelectedMemberIds(extractedIds);
        } catch (err) {
            console.error("Failed to fetch potential members", err);
        } finally {
            setAssignLoading(false);
        }
    };

    const handleToggleMember = (memberId) => {
        setSelectedMemberIds(prev => 
            prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
        );
    };

    const handleBulkAssign = async () => {
        if (!selectedTrainer) return;
        setAssignLoading(true);
        try {
            await userApi.post('/trainer/admin/assign-members', {
                trainerId: selectedTrainer.trainerId,
                memberIds: selectedMemberIds
            });
            setBulkAssignDialogOpen(false);
            fetchTrainerBasedData();
        } catch (err) {
            alert("Failed to assign members.");
        } finally {
            setAssignLoading(false);
        }
    };

    const handleRemoveTrainerFromMember = async (memberId) => {
        if (!window.confirm("Remove trainer from this member?")) return;
        try {
            await userApi.delete(`/member/gym/${gymId}/member/${memberId}/trainer`);
            fetchMemberBasedData();
        } catch (err) {
            console.error("Failed to remove trainer", err);
            alert("Failed to remove trainer.");
        }
    };

    const handleRemoveMemberFromTrainer = async (trainerId, memberId, memberName) => {
        if (!window.confirm(`Remove ${memberName} from this trainer?`)) return;
        try {
            await userApi.post(`/trainer/${trainerId}/remove-member/${memberId}`);
            fetchTrainerBasedData();
        } catch (err) {
            alert("Failed to remove member.");
        }
    };

    const filteredMembers = members.filter(m => 
        m.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredTrainers = trainers.filter(t => 
        t.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const hasTrainerAssigned = (m) => m.trainerName && m.trainerName.trim() !== "" && m.trainerName.toLowerCase() !== "no trainer assigned";

    return (
        <div className="db-card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Premium Animated Tabs Header - Light Theme Ready */}
            <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--db-border)', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                <div style={{ flex: '1 1 200px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, letterSpacing: '-0.3px', color: 'var(--db-text-primary)' }}>ASSIGNMENT <span style={{ color: 'var(--db-accent)' }}>HUB</span></h3>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: 'var(--db-text-secondary)', fontWeight: 600 }}>Manage roster assignments and track student pairs</p>
                </div>
                <div style={{ 
                    flexShrink: 0, 
                    display: 'flex', 
                    gap: '0.3rem', 
                    backgroundColor: 'var(--db-bg)', 
                    padding: '0.4rem', 
                    borderRadius: '16px', 
                    border: '1px solid var(--db-border)',
                    position: 'relative'
                }}>
                    <div style={{ display: 'flex', position: 'relative', zIndex: 1 }}>
                        <button 
                            onClick={() => setTab(0)}
                            style={{ 
                                padding: '0.55rem 1.4rem', border: 'none', borderRadius: '12px', cursor: 'pointer',
                                fontSize: '0.8rem', fontWeight: 900, transition: 'color 0.4s',
                                backgroundColor: 'transparent',
                                color: tab === 0 ? '#fff' : 'var(--db-text-secondary)',
                                position: 'relative'
                            }}
                        >
                            Member List
                        </button>
                        <button 
                            onClick={() => setTab(1)}
                            style={{ 
                                padding: '0.55rem 1.4rem', border: 'none', borderRadius: '12px', cursor: 'pointer',
                                fontSize: '0.8rem', fontWeight: 900, transition: 'color 0.4s',
                                backgroundColor: 'transparent',
                                color: tab === 1 ? '#fff' : 'var(--db-text-secondary)',
                                position: 'relative'
                            }}
                        >
                            Trainer List
                        </button>
                        
                        {/* Smooth Animated Pill */}
                        <motion.div
                            layoutId="assignmentTabPill"
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: tab === 0 ? 0 : '50%',
                                width: '50%',
                                height: '100%',
                                backgroundColor: 'var(--db-accent)',
                                borderRadius: '12px',
                                zIndex: -1,
                                boxShadow: '0 4px 15px rgba(251, 146, 60, 0.35)'
                            }}
                            transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                        />
                    </div>
                </div>
            </div>

            {/* Refined Search Area */}
            <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--db-border)', display: 'flex', gap: '1.25rem', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.005)' }}>
                <div style={{ 
                    flex: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    backgroundColor: 'var(--db-sidebar)', 
                    padding: '0.75rem 1.25rem', 
                    borderRadius: '16px',
                    border: '1px solid var(--db-border)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                }}>
                    <Search style={{ fontSize: '1.2rem', color: 'var(--db-accent)' }} />
                    <input 
                        style={{ 
                            border: 'none', 
                            backgroundColor: 'transparent', 
                            color: 'var(--db-text-primary)', 
                            width: '100%',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            outline: 'none'
                        }}
                        placeholder="Search" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Main Content Area */}
            {loading ? (
                <div style={{ padding: '4rem', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div>
            ) : isMobile ? (
                /* MOBILE CARD VIEW */
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {tab === 0 ? (
                        filteredMembers.map(m => {
                            const mId = m.memberId || m.userId || m.id;
                            const assigned = hasTrainerAssigned(m);
                            return (
                                <div key={mId} className="db-card" style={{ padding: '1.5rem', backgroundColor: 'var(--db-sidebar)', border: '1px solid var(--db-border)', borderRadius: '20px', transition: 'all 0.3s' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                                        <div className="avatar-sm" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(77, 171, 247, 0.12)', color: 'var(--db-blue)', fontSize: '1.1rem', fontWeight: 900 }}>{m.fullName?.[0]}</div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--db-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.fullName}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--db-text-secondary)', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.email}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.1rem 0', borderTop: '1px solid var(--db-border)', marginBottom: '0.75rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <span style={{ fontSize: '0.65rem', color: 'var(--db-text-secondary)', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.6px' }}>Current Trainer</span>
                                            {assigned ? (
                                                <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--db-accent)' }}>{m.trainerName}</span>
                                            ) : (
                                                <span style={{ fontSize: '0.85rem', opacity: 0.6, fontStyle: 'italic', fontWeight: 600 }}>Not Assigned</span>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                                        <button className="db-btn db-btn-outline" style={{ flex: 1, padding: '0.8rem', fontSize: '0.8rem', borderRadius: '14px', fontWeight: 900 }} onClick={() => { setSelectedMember(m); setAssignDialogOpen(true); }}>
                                            <Edit style={{ fontSize: '1rem' }} /> {assigned ? 'REALLOCATE' : 'ASSIGN'}
                                        </button>
                                        {assigned && (
                                            <button className="db-btn-icon btn-delete" style={{ width: '46px', height: '46px', borderRadius: '14px', border: '1px solid var(--db-border)' }} onClick={() => handleRemoveTrainerFromMember(mId)}>
                                                <Delete fontSize="small" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        filteredTrainers.map(t => {
                            const assignedMembers = trainerMembersMap[t.trainerId] || [];
                            return (
                                <div key={t.trainerId} className="db-card" style={{ padding: '1.5rem', backgroundColor: 'var(--db-sidebar)', border: '1px solid var(--db-border)', borderRadius: '20px', transition: 'all 0.3s' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                                        <div className="avatar-sm" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(132, 94, 247, 0.12)', color: 'var(--db-purple)', fontSize: '1.1rem', fontWeight: 900 }}>{t.fullName?.[0]}</div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--db-text-primary)' }}>{t.fullName}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--db-accent)', fontWeight: 800 }}>{assignedMembers.length} ACTIVE STUDENTS</div>
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '1.5rem', padding: '1.25rem', backgroundColor: 'var(--db-bg)', borderRadius: '16px', border: '1px solid var(--db-border)' }}>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--db-text-secondary)', marginBottom: '0.8rem', fontWeight: 900, letterSpacing: '0.7px' }}>CURRENT ROSTER</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {assignedMembers.slice(0, 3).map(m => (
                                                <span key={m.memberId} className="db-badge" style={{ fontSize: '0.65rem', backgroundColor: 'var(--db-card)', color: 'var(--db-text-primary)', border: '1px solid var(--db-border)', padding: '0.25rem 0.6rem', borderRadius: '8px', fontWeight: 700 }}>{m.fullName}</span>
                                            ))}
                                            {assignedMembers.length > 3 && <span style={{ fontSize: '0.7rem', color: 'var(--db-accent)', fontWeight: 900, padding: '0.2rem 0.5rem' }}>+{assignedMembers.length - 3} OTHERS</span>}
                                            {assignedMembers.length === 0 && <span style={{ fontSize: '0.75rem', opacity: 0.5, fontStyle: 'italic', fontWeight: 500 }}>Empty Roster</span>}
                                        </div>
                                    </div>
                                    <button className="db-btn db-btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '0.85rem', fontWeight: 900, borderRadius: '14px', boxShadow: '0 4px 12px rgba(251, 146, 60, 0.2)' }} onClick={() => handleBulkAssignClick(t)}>
                                        <Add style={{ fontSize: '1.2rem' }} /> MANAGE ROSTER
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            ) : (
                /* DESKTOP TABLE VIEW */
                <div className="db-table-container" style={{ border: 'none', borderRadius: 0 }}>
                    <table className="db-table">
                        <thead>
                            {tab === 0 ? (
                                <tr>
                                    <th>Member</th>
                                    <th>Assigned Trainer</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            ) : (
                                <tr>
                                    <th>Trainer</th>
                                    <th>Members</th>
                                    <th style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            )}
                        </thead>
                        <tbody>
                            {tab === 0 ? (
                                filteredMembers.map((m, index) => {
                                    const mId = m.memberId || m.userId || m.id;
                                    return (
                                    <tr key={mId || index}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div className="avatar-sm" style={{ backgroundColor: 'rgba(77, 171, 247, 0.1)', color: 'var(--db-blue)' }}>{m.fullName?.[0]}</div>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{m.fullName}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--db-text-secondary)' }}>{m.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {hasTrainerAssigned(m) ? (
                                                <span className="db-badge db-badge-outline badge-trainer" style={{ gap: '0.4rem' }}>
                                                    <AssignmentInd style={{ fontSize: '0.9rem' }} /> {m.trainerName}
                                                </span>
                                            ) : (
                                                <span style={{ fontSize: '0.85rem', color: 'var(--db-text-secondary)', fontStyle: 'italic' }}>Unassigned</span>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button className="db-btn db-btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => { setSelectedMember(m); setAssignDialogOpen(true); }}>
                                                    <Edit style={{ fontSize: '0.9rem' }} /> {hasTrainerAssigned(m) ? 'Update' : 'Assign'}
                                                </button>
                                                {hasTrainerAssigned(m) && (
                                                    <button className="db-btn-icon btn-delete" onClick={() => handleRemoveTrainerFromMember(mId)}>
                                                        <Delete fontSize="small" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                    );
                                })
                            ) : (
                                filteredTrainers.map(t => {
                                    const assignedMembers = trainerMembersMap[t.trainerId] || [];
                                    const isExpanded = expandedTrainers[t.trainerId] || false;
                                    return (
                                        <React.Fragment key={t.trainerId}>
                                            <tr>
                                                <td>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                        <div className="avatar-sm" style={{ backgroundColor: 'rgba(132, 94, 247, 0.1)', color: 'var(--db-purple)' }}>{t.fullName?.[0]}</div>
                                                        <div>
                                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.fullName}</div>
                                                            <div style={{ fontSize: '0.75rem', color: 'var(--db-text-secondary)' }}>{assignedMembers.length} active students</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                        {assignedMembers.slice(0, 2).map(m => (
                                                            <span key={m.memberId} className="db-badge db-badge-solid badge-member" style={{ fontSize: '0.7rem' }}>{m.fullName}</span>
                                                        ))}
                                                        {assignedMembers.length > 2 && (
                                                            <button 
                                                                onClick={() => setExpandedTrainers(prev => ({ ...prev, [t.trainerId]: !isExpanded }))}
                                                                style={{ background: 'none', border: 'none', color: 'var(--db-accent)', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                                                            >
                                                                +{assignedMembers.length - 2} more
                                                            </button>
                                                        )}
                                                        {assignedMembers.length === 0 && <span style={{ fontSize: '0.85rem', color: 'var(--db-text-secondary)', fontStyle: 'italic' }}>Empty roster</span>}
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    <button className="db-btn db-btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => handleBulkAssignClick(t)}>
                                                        <Add style={{ fontSize: '0.9rem' }} /> Manage
                                                    </button>
                                                </td>
                                            </tr>
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                        <td colSpan={3} style={{ backgroundColor: 'rgba(255,255,255,0.01)', padding: '1rem 3rem' }}>
                                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                                                {assignedMembers.map(m => (
                                                                    <div key={m.memberId} className="db-badge db-badge-outline badge-member" style={{ gap: '0.4rem' }}>
                                                                        {m.fullName}
                                                                        <Close 
                                                                            style={{ fontSize: '0.8rem', cursor: 'pointer' }} 
                                                                            onClick={() => handleRemoveMemberFromTrainer(t.trainerId, m.memberId, m.fullName)} 
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </td>
                                                    </motion.tr>
                                                )}
                                            </AnimatePresence>
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Premium Modal for Bulk Assignment - Light Theme Optimized */}
            <AnimatePresence>
                {bulkAssignDialogOpen && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem' }}>
                        <motion.div 
                            initial={{ y: 40, opacity: 0, scale: 0.95 }} 
                            animate={{ y: 0, opacity: 1, scale: 1 }} 
                            exit={{ y: 40, opacity: 0, scale: 0.95 }}
                            className="db-card" 
                            style={{ 
                                width: '100%', 
                                maxWidth: '520px', 
                                padding: '0', 
                                maxHeight: '85vh', 
                                display: 'flex', 
                                flexDirection: 'column',
                                overflow: 'hidden',
                                backgroundColor: 'var(--db-card)',
                                border: '1px solid var(--db-border)',
                                boxShadow: '0 25px 60px -12px rgba(0,0,0,0.3)',
                                borderRadius: '24px'
                            }}
                        >
                            <div style={{ padding: '2rem', borderBottom: '1px solid var(--db-border)', backgroundColor: 'var(--db-bg)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: 'var(--db-text-primary)' }}>Roster <span style={{ color: 'var(--db-accent)' }}>Setup</span></h3>
                                        <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', color: 'var(--db-text-secondary)', fontWeight: 600 }}>Assigning students to {selectedTrainer?.fullName}</p>
                                    </div>
                                    <button className="db-btn-icon" style={{ borderRadius: '12px', backgroundColor: 'var(--db-card)', border: '1px solid var(--db-border)' }} onClick={() => setBulkAssignDialogOpen(false)}><Close style={{ fontSize: '1.2rem' }} /></button>
                                </div>
                            </div>
                            
                            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', backgroundColor: 'var(--db-card)' }}>
                                {assignLoading ? (
                                    <div style={{ padding: '5rem 0', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto', borderColor: 'var(--db-accent) transparent transparent transparent' }}></div></div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                                        {potentialMembers.length > 0 ? (
                                            potentialMembers.map((member) => {
                                                const mId = member.memberId || member.userId || member.id;
                                                const isSelected = selectedMemberIds.includes(mId);
                                                return (
                                                    <div 
                                                        key={mId} 
                                                        onClick={() => handleToggleMember(mId)}
                                                        className="glass-panel"
                                                        style={{ 
                                                            display: 'flex', alignItems: 'center', gap: '1.1rem', padding: '1.1rem', 
                                                            borderRadius: '16px', cursor: 'pointer', transition: 'all 0.25s',
                                                            backgroundColor: isSelected ? 'rgba(251, 146, 60, 0.08)' : 'var(--db-bg)',
                                                            border: isSelected ? '1px solid var(--db-accent)' : '1px solid var(--db-border)',
                                                            transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                                                        }}
                                                    >
                                                        <div style={{ 
                                                            width: '24px', height: '24px', borderRadius: '8px', 
                                                            border: '2px solid', 
                                                            borderColor: isSelected ? 'var(--db-accent)' : 'var(--db-border)',
                                                            backgroundColor: isSelected ? 'var(--db-accent)' : 'transparent',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: '#fff', transition: 'all 0.2s',
                                                            flexShrink: 0
                                                        }}>
                                                            {isSelected && <Add style={{ fontSize: '16px', strokeWidth: 4 }} />}
                                                        </div>
                                                        <div className="avatar-sm" style={{ width: '42px', height: '42px', backgroundColor: 'rgba(77, 171, 247, 0.12)', color: 'var(--db-blue)', fontWeight: 900 }}>{member.fullName[0]}</div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--db-text-primary)' }}>{member.fullName}</div>
                                                            <div style={{ fontSize: '0.7rem', color: isSelected ? 'var(--db-accent)' : 'var(--db-text-secondary)', fontWeight: 700 }}>
                                                                {member.trainerName && member.trainerName !== 'No trainer assigned' ? `Current: ${member.trainerName}` : 'Available for assignment'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div style={{ padding: '4rem 1rem', textAlign: 'center', opacity: 0.6 }}>
                                                <p style={{ fontWeight: 600 }}>No members found for this gym location.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div style={{ padding: '1.75rem 2rem', borderTop: '1px solid var(--db-border)', backgroundColor: 'var(--db-bg)', display: 'flex', gap: '1.25rem' }}>
                                <button className="db-btn db-btn-outline" style={{ flex: 1, borderRadius: '14px', fontWeight: 900, padding: '1rem' }} onClick={() => setBulkAssignDialogOpen(false)}>CANCEL</button>
                                <button className="db-btn db-btn-primary" style={{ flex: 2, borderRadius: '14px', fontWeight: 900, letterSpacing: '0.6px', padding: '1rem', boxShadow: '0 4px 15px rgba(251, 146, 60, 0.3)' }} onClick={handleBulkAssign} disabled={assignLoading}>
                                    SAVE ROSTER ({selectedMemberIds.length})
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {selectedMember && (
                <AssignTrainerDialog
                    open={assignDialogOpen}
                    onClose={() => { setAssignDialogOpen(false); setSelectedMember(null); }}
                    gymId={gymId}
                    memberId={selectedMember.memberId || selectedMember.userId || selectedMember.id}
                    onAssignSuccess={() => { setAssignDialogOpen(false); fetchMemberBasedData(); }}
                />
            )}
        </div>
    );
};

export default AssignmentsCard;
