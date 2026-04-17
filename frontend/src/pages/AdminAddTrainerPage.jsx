import React, { useState, useEffect, useRef } from "react";
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from "framer-motion";

// Custom SVG Icons
const IconPlus = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const IconSearch = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const IconUsers = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);
const IconClose = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const IconFitness = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18c-2 0-4-2-4-4s2-4 4-4 4 2 4 4-2 4-4 4z"/><path d="M18 18c-2 0-4-2-4-4s2-4 4-4 4 2 4 4-2 4-4 4z"/><path d="M7 14h10"/><path d="M9 11l-2-2"/><path d="M17 11l2-2"/><path d="M9 17l-2 2"/><path d="M17 17l2 2"/></svg>
);
const IconChevronDown = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
);
import TrainerAddForm from "../components/TrainerAddForm";
import { TrainerDetailView } from "../components/TrainerDetailView";
import { TrainerRegistrationProvider, useTrainerRegistration } from "../context/TrainerRegistrationContext";
import TrainerRow from "../components/TrainerRow";
import AssignMembersDialog from "../components/AssignMembersDialog";
import { userApi } from "../services/api";
import ConfirmationDialog from "../components/ConfirmationDialog";
import '../styles/dashboard.css';

const AdminAddTrainerPageContent = () => {
  const {
    isLoading,
    successMessage,
    apiError,
    clearMessages,
    fetchTrainers,
    searchTrainers,
    addMultipleTrainers,
    deleteTrainer,
    updateTrainer,
    resendInvite,
    getTrainerById,
    assignMembers,
    gyms,
    fetchGyms
  } = useTrainerRegistration();

  const [sidePanel, setSidePanel] = useState({
    open: false,
    view: "none", // 'add', 'edit', 'detail'
    data: null,
  });

  const [originalTrainers, setOriginalTrainers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [localSearchResults, setLocalSearchResults] = useState([]);
  const [isSearchingAPI, setIsSearchingAPI] = useState(false);
  const [selectedGymId, setSelectedGymId] = useState("all");
  const searchTimeoutRef = useRef(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    userApi.get("/admin/dashboard/18").then((res) => setStats(res.data)).catch(console.error);
    fetchGyms();
  }, []);

  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    severity: "warning",
    onConfirm: null,
  });

  // Assign Dialog State
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [trainerForAssign, setTrainerForAssign] = useState(null);

  // Load trainers
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const gymId = selectedGymId === "all" ? null : selectedGymId;
        const data = await fetchTrainers(gymId);
        const list = Array.isArray(data) ? data : [];
        if (mounted) {
          setOriginalTrainers(list);
          setTrainers(list);
        }
      } catch (err) {
        console.error("Failed to load trainers:", err);
      }
    };
    load();
    return () => (mounted = false);
  }, [fetchTrainers, selectedGymId]);

  // Search
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      setLocalSearchResults([]);
      setTrainers(originalTrainers);
      setIsSearchingAPI(false);
      return;
    }

    const filtered = originalTrainers.filter((t) => (
      (t.fullName?.toLowerCase().includes(term)) ||
      (t.email?.toLowerCase().includes(term)) ||
      (t.phoneNo?.includes(term)) ||
      (t.specialization?.toLowerCase().includes(term)) ||
      (t.gymName?.toLowerCase().includes(term))
    ));
    setLocalSearchResults(filtered);

    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearchingAPI(true);
      try {
        const gymId = selectedGymId === "all" ? null : selectedGymId;
        const results = await searchTrainers(term, gymId);
        setTrainers(Array.isArray(results) ? results : []);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsSearchingAPI(false);
      }
    }, 600);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchTerm, originalTrainers, searchTrainers, selectedGymId]);

  const displayTrainers = searchTerm.trim() ? localSearchResults : trainers;

  const closePanel = () => {
    setSidePanel({ open: false, view: "none", data: null });
    clearMessages();
  };

  const handleAddSuccess = async (payloadArray) => {
    const arr = Array.isArray(payloadArray) ? payloadArray : [payloadArray];
    await addMultipleTrainers(arr);
    const gymId = selectedGymId === "all" ? null : selectedGymId;
    const updated = await fetchTrainers(gymId);
    setOriginalTrainers(Array.isArray(updated) ? updated : []);
    setTrainers(Array.isArray(updated) ? updated : []);
    closePanel();
  };

  const handleEditSuccess = async (payload) => {
    if (sidePanel.data) {
      const id = sidePanel.data.trainerId || sidePanel.data.id;
      await updateTrainer(id, payload);
      const gymId = selectedGymId === "all" ? null : selectedGymId;
      const updated = await fetchTrainers(gymId);
      setOriginalTrainers(Array.isArray(updated) ? updated : []);
      setTrainers(Array.isArray(updated) ? updated : []);
      closePanel();
    }
  };

  const openAddTrainer = () => {
    setSidePanel({ open: true, view: "add", data: null });
  };

  const openEdit = (trainer) => {
    if (trainer) setSidePanel({ open: true, view: "edit", data: trainer });
  };

  const openDetail = (trainer) => {
    if (trainer) setSidePanel({ open: true, view: "detail", data: trainer });
  };

  const handleResend = (userId) => {
    setConfirmDialog({
      open: true,
      title: "Resend Invite?",
      message: "Resend the registration invitation link to this trainer?",
      severity: "info",
      confirmText: "Resend",
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, open: false }));
        await resendInvite(userId);
      }
    });
  };

  const handleDelete = (trainerId) => {
    setConfirmDialog({
      open: true,
      title: "Delete Trainer?",
      message: "Are you sure you want to soft-delete this trainer?",
      severity: "error",
      confirmText: "Delete",
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, open: false }));
        const ok = await deleteTrainer(trainerId);
        if (ok) {
          const gymId = selectedGymId === "all" ? null : selectedGymId;
          const updated = await fetchTrainers(gymId);
          setOriginalTrainers(Array.isArray(updated) ? updated : []);
          setTrainers(Array.isArray(updated) ? updated : []);
        }
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

      <div className="admin-content-layout" style={{ position: "relative" }}>
        <div
           className="admin-main-section"
           style={{ width: '100%' }}
         >
          {/* Filters Row */}
          <div className="db-filters-row">
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <div className="icon-box-sm" style={{ backgroundColor: 'rgba(132, 94, 247, 0.1)', color: 'var(--db-purple)' }}>
                <IconFitness />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>All Trainers</h3>
                <p style={{ margin: 0, color: 'var(--db-text-secondary)', fontSize: '0.85rem' }}>
                  {trainers.length} staff members found
                </p>
              </div>
            </div>

            <div className="filters-controls-container" style={{ display: "flex", gap: "1rem", flex: 1, justifyContent: "flex-end", flexWrap: 'wrap' }}>
              <div className="db-select-wrapper no-after" style={{ width: '100%', maxWidth: '200px' }}>
                <select className="db-select" value={selectedGymId} onChange={(e) => setSelectedGymId(e.target.value)}>
                  <option value="all" style={{ backgroundColor: 'var(--db-card)', color: 'var(--db-text-primary)' }}>All Gyms</option>
                  {Array.isArray(gyms) && gyms.map(gym => (
                    <option key={gym.gymId} value={gym.gymId} style={{ backgroundColor: 'var(--db-card)', color: 'var(--db-text-primary)' }}>{gym.gymName}</option>
                  ))}
                </select>
                <div style={{ 
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    opacity: 0.7,
                    pointerEvents: 'none'
                }}>
                    <IconChevronDown />
                </div>
              </div>

              <div className="db-search-wrapper" style={{ flex: 1, minWidth: '200px' }}>
                <IconSearch />
                <input 
                  type="text" 
                  className="db-search-input" 
                  placeholder="Filter trainers..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button className="db-btn db-btn-primary" onClick={openAddTrainer}>
                <IconPlus /> Add Trainer
              </button>
            </div>
          </div>

          {/* Trainers Table */}
          <div className="db-table-container">
            {isLoading || (isSearchingAPI && searchTerm.trim()) ? (
              <div style={{ padding: '4rem', textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '0 auto' }}></div>
              </div>
            ) : displayTrainers.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--db-text-secondary)' }}>
                 No trainers found.
              </div>
            ) : (
              <table className="db-table">
                <thead>
                  <tr>
                    <th>Trainer Details</th>
                    <th>Phone</th>
                    <th>Specialization</th>
                    <th>Experience</th>
                <th>Gym</th>
                <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {displayTrainers.map((t, index) => (
                      <TrainerRow
                        key={t.trainerId || t.id || index}
                        trainer={t}
                        isSelected={sidePanel.open && sidePanel.data && (sidePanel.data.trainerId === (t.trainerId || t.id) || sidePanel.data.id === (t.trainerId || t.id))}
                        onDetail={() => openDetail(t)}
                        onEdit={() => openEdit(t)}
                        onResend={() => handleResend(t.userId || t.trainerId || t.id)}
                        onDelete={() => handleDelete(t.trainerId || t.id)}
                      />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            )}
          </div>
        </div>

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
                          {sidePanel.view === 'add' ? 'Register New Trainer' : sidePanel.view === 'edit' ? 'Update Trainer Info' : 'Trainer Profile Overview'}
                       </h3>
                       <button className="db-btn-icon" onClick={closePanel} style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                          <IconClose />
                       </button>
                    </div>
                    
                    <div style={{ padding: '2rem 1.5rem', backgroundColor: 'var(--db-card)', overflowY: 'auto', flex: 1 }}>
                      {sidePanel.view === "add" && <TrainerAddForm onSuccess={handleAddSuccess} multiple onCancel={closePanel} />}
                      {sidePanel.view === "edit" && sidePanel.data && <TrainerAddForm onSuccess={handleEditSuccess} trainer={sidePanel.data} onCancel={closePanel} />}
                      {sidePanel.view === "detail" && sidePanel.data && (
                        <TrainerDetailView 
                            trainer={sidePanel.data} 
                            onClose={closePanel}
                            onAssignMembers={() => {
                                setTrainerForAssign(sidePanel.data);
                                setAssignDialogOpen(true);
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

      <AssignMembersDialog 
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
        trainer={trainerForAssign}
        onAssign={assignMembers}
      />
      
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

const AdminAddTrainerPage = () => (
  <TrainerRegistrationProvider>
    <AdminAddTrainerPageContent />
  </TrainerRegistrationProvider>
);

export default AdminAddTrainerPage;
