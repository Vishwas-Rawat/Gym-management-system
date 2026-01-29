import React, { useState, useEffect, useRef } from "react";
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from "framer-motion";
import MemberAddForm from "../components/MemberAddForm";
import { MemberDetailView } from "../components/MemberDetailModal";
import { MemberRegistrationProvider, useMemberRegistration } from "../context/MemberRegistrationContext";
import MemberRow from "../components/MemberRow";
import { userApi } from "../services/api";
import ConfirmationDialog from "../components/ConfirmationDialog";
import '../styles/dashboard.css';

// SVG Icons to replace MUI
const IconPlus = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const IconSearch = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const IconGroup = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const IconClose = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const IconUserPlus = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
);

const AdminAddMemberPageContent = () => {
  const {
    isLoading,
    successMessage,
    apiError,
    clearMessages,
    fetchMembers,
    searchMembers,
    addMultipleMembers,
    deleteMember,
    updateMember,
    resendInvite,
    sendPaymentReminder,
    getMemberDetail,
    getMemberById,
    gyms,
    fetchGyms
  } = useMemberRegistration();

  const [sidePanel, setSidePanel] = useState({
    open: false,
    view: "none", // 'add', 'edit', 'detail'
    data: null,
    loading: false,
  });

  const [originalMembers, setOriginalMembers] = useState([]);
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [localSearchResults, setLocalSearchResults] = useState([]);
  const [isSearchingAPI, setIsSearchingAPI] = useState(false);
  const [selectedGymId, setSelectedGymId] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // ✅ Added state
  const dropdownRef = useRef(null); // ✅ Added ref
  const searchTimeoutRef = useRef(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    userApi.get("/admin/dashboard/18").then((res) => setStats(res.data)).catch(console.error);
    fetchGyms();
  }, []);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    severity: "warning",
    onConfirm: null,
  });

  // Load members
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const gymId = selectedGymId === "all" ? null : selectedGymId;
      const data = await fetchMembers(gymId);
      if (mounted) {
        setOriginalMembers(data || []);
        setMembers(data || []);
      }
    };
    load();
    return () => (mounted = false);
  }, [fetchMembers, selectedGymId]);

  // Search
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    const term = searchTerm.trim();

    if (!term) {
      setLocalSearchResults([]);
      setMembers(originalMembers);
      setIsSearchingAPI(false);
      return;
    }

    const filtered = originalMembers.filter(
      (m) =>
        (m.fullName?.toLowerCase().includes(term.toLowerCase()) ||
          m.email?.toLowerCase().includes(term.toLowerCase()) ||
          m.phoneNo?.includes(term) ||
          m.phoneNumber?.includes(term))
    );
    setLocalSearchResults(filtered);

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearchingAPI(true);
      try {
        const gymId = selectedGymId === "all" ? null : selectedGymId;
        const results = await searchMembers(term, gymId);
        setMembers(results || []);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsSearchingAPI(false);
      }
    }, 600);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchTerm, originalMembers, searchMembers, selectedGymId]);

  const displayMembers = searchTerm.trim() ? localSearchResults : members;

  const closePanel = () => {
    setSidePanel({ open: false, view: "none", data: null, loading: false });
    clearMessages();
  };

  const handleAddSuccess = async (payloadArray) => {
    const arr = Array.isArray(payloadArray) ? payloadArray : [payloadArray];
    await addMultipleMembers(arr);
    const gymId = selectedGymId === "all" ? null : selectedGymId;
    const updated = await fetchMembers(gymId);
    setOriginalMembers(updated || []);
    setMembers(updated || []);
    closePanel();
  };

  const handleEditSuccess = async (payload) => {
    if (sidePanel.data) {
      await updateMember(sidePanel.data.id, payload);
      const gymId = selectedGymId === "all" ? null : selectedGymId;
      const updated = await fetchMembers(gymId);
      setOriginalMembers(updated || []);
      setMembers(updated || []);
      closePanel();
    }
  };

  const openAddMember = () => {
    setSidePanel({ open: true, view: "add", data: null });
  };

  const openEdit = (member) => {
    if (member) setSidePanel({ open: true, view: "edit", data: member, loading: false });
  };

  const openDetail = (member) => {
    if (member) setSidePanel({ open: true, view: "detail", data: member });
  };

  const handleResend = (userId) => {
    setConfirmDialog({
      open: true,
      title: "Resend Invite?",
      message: "This will regenerate the registration token and send a new link to the user.",
      severity: "info",
      confirmText: "Resend",
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, open: false }));
        await resendInvite(userId);
      }
    });
  };

  const handleDelete = (memberId) => {
    setConfirmDialog({
      open: true,
      title: "Delete Member?",
      message: "Are you sure you want to soft-delete this member?",
      severity: "error",
      confirmText: "Delete",
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, open: false }));
        const ok = await deleteMember(memberId);
        if (ok) {
          const gymId = selectedGymId === "all" ? null : selectedGymId;
          const updated = await fetchMembers(gymId);
          setOriginalMembers(updated || []);
          setMembers(updated || []);
        }
      }
    });
  };

  const handlePaymentReminder = (memberId) => {
    setConfirmDialog({
      open: true,
      title: "Send Reminder?",
      message: "Send a payment reminder notification to this member?",
      severity: "info",
      confirmText: "Send",
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, open: false }));
        await sendPaymentReminder(memberId);
      }
    });
  };

  return (
    <div className="dashboard-content-inner">
      {/* Alert Messages */}
      <AnimatePresence mode="wait">
        {successMessage && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
             style={{ padding: '1rem', backgroundColor: 'rgba(81, 207, 102, 0.1)', color: 'var(--db-green)', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(81, 207, 102, 0.2)' }}>
            {successMessage}
          </motion.div>
        )}
        {apiError && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
             style={{ padding: '1rem', backgroundColor: 'rgba(238, 82, 83, 0.1)', color: '#ee5253', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(238, 82, 83, 0.2)' }}>
            {apiError}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="admin-content-layout" style={{ display: "flex", alignItems: "flex-start", gap: "2rem", position: "relative", flexWrap: "wrap" }}>
        {/* Main Section */}
        {(!sidePanel.open || window.innerWidth > 1200) && (
          <div
             className="admin-main-section"
             style={{ width: '100%' }}
           >
          {/* Filters Row */}
          <div className="db-filters-row">
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <div className="icon-box-sm" style={{ backgroundColor: 'rgba(255, 107, 107, 0.1)', color: 'var(--db-accent)' }}>
                <IconGroup />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>All Members</h3>
                <p style={{ margin: 0, color: 'var(--db-text-secondary)', fontSize: '0.85rem' }}>
                  {displayMembers.length} active records
                </p>
              </div>
            </div>

            <div className="filters-controls-container" style={{ display: "flex", gap: "1rem", flex: 1, width: '100%', flexDirection: 'column' }}>
              <div className="db-select-wrapper no-after" ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
                {/* Custom Styled Dropdown Trigger */}
                <div 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        backgroundColor: 'var(--db-card)',
                        border: '1px solid var(--db-border)',
                        borderRadius: '12px',
                        color: 'var(--db-text-primary)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        transition: 'all 0.2s',
                        boxShadow: isDropdownOpen ? '0 0 0 2px rgba(251, 146, 60, 0.2)' : 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(var(--db-accent-rgb, 251, 146, 60), 0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--db-card)'}
                >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                         {selectedGymId === 'all' ? (
                            "All Gyms"
                         ) : (
                            gyms.find(g => g.gymId.toString() === selectedGymId.toString())?.gymName || 'Select Gym'
                         )}
                    </span>
                    <div style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'flex', opacity: 0.7 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                </div>

                {/* Dropdown Menu */}
                <AnimatePresence>
                    {isDropdownOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            style={{
                                position: 'absolute',
                                top: 'calc(100% + 6px)',
                                left: 0,
                                right: 0,
                                backgroundColor: 'var(--db-sidebar)',
                                border: '1px solid var(--db-border)',
                                borderRadius: '14px',
                                overflow: 'hidden',
                                zIndex: 105,
                                boxShadow: 'var(--glass-shadow)',
                                padding: '6px'
                            }}
                        >
                            <div 
                                onClick={() => { setSelectedGymId("all"); setIsDropdownOpen(false); }}
                                className="dropdown-item"
                                style={{
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    color: selectedGymId === 'all' ? '#fff' : 'var(--db-text-secondary)',
                                    backgroundColor: selectedGymId === 'all' ? 'var(--db-accent)' : 'transparent',
                                    fontWeight: selectedGymId === 'all' ? '600' : '500',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    marginBottom: '4px'
                                }}
                            >
                                All Gyms
                            </div>
                            
                            <div style={{ height: '1px', backgroundColor: 'var(--db-border)', margin: '4px 0' }}></div>

                            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                {gyms.map(gym => (
                                    <div 
                                        key={gym.gymId}
                                        onClick={() => { setSelectedGymId(gym.gymId); setIsDropdownOpen(false); }}
                                        className="dropdown-item"
                                        style={{
                                            padding: '10px 12px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            color: selectedGymId === gym.gymId ? '#fff' : 'var(--db-text-primary)',
                                            backgroundColor: selectedGymId === gym.gymId ? 'var(--db-accent)' : 'transparent',
                                            fontWeight: selectedGymId === gym.gymId ? '600' : '500',
                                            fontSize: '0.9rem',
                                            marginBottom: '2px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px'
                                        }}
                                        onMouseEnter={(e) => {
                                            if(selectedGymId !== gym.gymId) {
                                                e.currentTarget.style.backgroundColor = 'rgba(var(--db-accent-rgb, 251, 146, 60), 0.08)';
                                                e.currentTarget.style.color = 'var(--db-accent)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if(selectedGymId !== gym.gymId) {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                e.currentTarget.style.color = 'var(--db-text-primary)';
                                            }
                                        }}
                                    >
                                        {gym.gymName}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
              </div>

              <div className="db-search-wrapper" style={{ width: '100%' }}>
                <IconSearch />
                <input 
                  type="text" 
                  className="db-search-input" 
                  placeholder="Filter name, email..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button className="db-btn db-btn-primary" onClick={openAddMember} style={{ width: '100%', justifyContent: 'center' }}>
                <IconUserPlus /> Add Member
              </button>
            </div>
          </div>

          {/* Members Table */}
          <div className="db-table-container">
            {isLoading || (isSearchingAPI && searchTerm.trim()) ? (
              <div style={{ padding: '4rem', textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto' }}></div>
              </div>
            ) : displayMembers.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--db-text-secondary)' }}>
                 No members found.
              </div>
            ) : (
              <table className="db-table">
                <thead>
                  <tr>
                    <th>Member Details</th>
                    <th>Plan</th>
                    <th>Workout</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {displayMembers.map((m, index) => {
                      const id = m.memberId || m.id || m.gymMemberId;
                      const isSelected = sidePanel.open && sidePanel.data && (sidePanel.data.memberId === id || sidePanel.data.id === id);
                      // Find gym name
                      const memberGym = gyms.find(g => g.gymId === m.gymId);
                      const gymName = memberGym ? memberGym.gymName : '';

                      return (
                        <MemberRow
                          key={id || index}
                          member={m}
                          gymName={gymName}
                          isSelected={isSelected}
                          onDetail={() => openDetail(m)}
                          onEdit={() => openEdit(m)}
                          onPaymentReminder={() => handlePaymentReminder(id)}
                          onResend={() => handleResend(m.userId || id)}
                          onDelete={() => handleDelete(id)}
                        />
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>
          </div>
        )}

        {/* Side Panel */}
        {/* Modal Popup Overlay */}
        {createPortal(
          <AnimatePresence>
            {sidePanel.open && (
              <motion.div
                key="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="modal-overlay"
                style={{ display: 'flex' }} // Keep flex for children alignment
                onClick={closePanel}
              >
                <motion.div
                  key="modal-container"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="modal-container"
                  style={{
                     width: '100%',
                     maxWidth: sidePanel.view === 'detail' ? '900px' : '700px',
                     position: 'relative'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="db-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', maxHeight: '90vh' }}>
                    <div style={{ 
                      padding: '1.5rem', 
                      borderBottom: '1px solid var(--db-border)', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      backgroundColor: 'var(--db-card)',
                      flexShrink: 0, // Prevent header from shrinking
                      zIndex: 10
                    }}>
                       <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
                          {sidePanel.view === 'add' ? 'Register New Member' : sidePanel.view === 'edit' ? 'Update Member Info' : 'Member Profile Overview'}
                       </h3>
                       <button className="db-btn-icon" onClick={closePanel} style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                          <IconClose />
                       </button>
                    </div>
                    
                    <div style={{ padding: '2rem 1.5rem', backgroundColor: 'var(--db-card)', overflowY: 'auto', flex: 1 }}>
                      {sidePanel.view === "add" && <MemberAddForm onSuccess={handleAddSuccess} multiple onCancel={closePanel} />}
                      {sidePanel.view === "edit" && (
                        sidePanel.loading ? <div style={{ display: 'flex', justifyContent: 'center', p: 4 }}><div className="spinner"></div></div> :
                        sidePanel.data && <MemberAddForm onSuccess={handleEditSuccess} member={sidePanel.data} onCancel={closePanel} />
                      )}
                      {sidePanel.view === "detail" && sidePanel.data && (
                        <MemberDetailView 
                            member={sidePanel.data} 
                            onClose={closePanel} 
                            onAssignSuccess={async () => {
                                const gymId = selectedGymId === "all" ? null : selectedGymId;
                                const updated = await fetchMembers(gymId);
                                setOriginalMembers(updated || []);
                                setMembers(updated || []);
                                const mem = await getMemberDetail(sidePanel.data.memberId || sidePanel.data.id);
                                if (mem) setSidePanel(prev => ({ ...prev, data: mem }));
                            }}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>

      <ConfirmationDialog 
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        severity={confirmDialog.severity}
        confirmText={confirmDialog.confirmText}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
      />
    </div>
  );
};

const AdminAddMemberPage = () => (
  <MemberRegistrationProvider>
    <AdminAddMemberPageContent />
  </MemberRegistrationProvider>
);

export default AdminAddMemberPage;