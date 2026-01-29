
import React, { useEffect, useState } from 'react';
import { useGym } from '../context/GymContext';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css';

// SVG Icons (Lucide / Material alternative)
const Icons = {
  Add: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
  Edit: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
  Delete: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  Business: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>,
  Location: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  Phone: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>,
  Email: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
  Time: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
};

const AdminGymsPage = () => {
  const { gyms, loading, error, getMyGyms, updateGym, deleteGym, forceDeleteGym } = useGym();
  const navigate = useNavigate();
  const [openEdit, setOpenEdit] = useState(false);
  const [currentGym, setCurrentGym] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  // Force Delete State
  const [forceDeleteModal, setForceDeleteModal] = useState(false);
  const [gymToDelete, setGymToDelete] = useState(null);

  useEffect(() => {
    getMyGyms();
  }, []);

  const handleEditClick = (gym) => {
    setCurrentGym(gym);
    setEditFormData({
      gymName: gym.gymName,
      address: gym.address,
      city: gym.city,
      state: gym.state,
      contactNumber: gym.contactNumber,
      email: gym.email,
      openingHours: gym.openingHours,
    });
    setOpenEdit(true);
  };

  const handleDeleteClick = async (gym) => {
    if (window.confirm("Are you sure you want to delete this gym?")) {
      setActionLoading(true);
      const result = await deleteGym(gym.gymId);
      setActionLoading(false);
      
      if (!result.success) {
        // If basic delete fails (likely due to active members), open Force Delete
        setGymToDelete(gym);
        setForceDeleteModal(true);
      }
    }
  };

  const handleForceDelete = async () => {
    if (!gymToDelete) return;
    setActionLoading(true);
    const result = await forceDeleteGym(gymToDelete.gymId);
    setActionLoading(false);
    
    if (result.success) {
      setForceDeleteModal(false);
      setGymToDelete(null);
      // Optional: Show success toast
    } else {
      alert(result.message);
    }
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setCurrentGym(null);
    setEditFormData({});
    setActionError('');
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setActionError('');
    const result = await updateGym(currentGym.gymId, editFormData);
    setActionLoading(false);
    if (result.success) {
      handleEditClose();
    } else {
      setActionError(result.message);
    }
  };

  if (loading && gyms.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#94a3b8' }}>
        Loading gyms...
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="page-header">
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, color: 'var(--db-text-primary)' }}>My Gyms</h1>
        <button 
          className="db-btn db-btn-primary" 
          onClick={() => navigate('/gym-register')}
          style={{ padding: '0.8rem 1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
        >
          <Icons.Add />
          Add New Gym
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '10px', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          {error}
        </div>
      )}

      {/* Grid */}
      <div className="gyms-grid">
        {gyms.map((gym) => (
          <div key={gym.gymId} className="gym-card">
            <div className="card-content">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ color: 'var(--db-accent)', marginRight: '0.5rem' }}><Icons.Business /></span>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--db-text-primary)' }}>{gym.gymName}</h3>
              </div>

              <div className="gym-info-row">
                <Icons.Location />
                <span>{gym.address}, {gym.city}, {gym.state}</span>
              </div>

              <div className="gym-info-row">
                <Icons.Phone />
                <span>{gym.contactNumber}</span>
              </div>

              <div className="gym-info-row">
                <Icons.Email />
                <span>{gym.email}</span>
              </div>

              <div className="gym-info-row">
                <Icons.Time />
                <span>{gym.openingHours}</span>
              </div>
            </div>

            <div className="card-actions">
              <button 
                className="db-btn-icon" 
                onClick={() => handleEditClick(gym)}
                title="Edit Gym"
              >
                <Icons.Edit />
              </button>
              <button 
                className="db-btn-icon btn-delete" 
                onClick={() => handleDeleteClick(gym)}
                title="Delete Gym"
                style={{ color: '#ef4444' }}
              >
                <Icons.Delete />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {openEdit && (
        <div className="modal-overlay" onClick={handleEditClose}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ overflowY: 'auto', maxHeight: '90vh' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--db-text-primary)', textAlign: 'center' }}>Update Gym</h2>
            
            {actionError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                {actionError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="db-label">Gym Name</label>
                <input 
                  className="db-input" 
                  name="gymName"
                  value={editFormData.gymName || ''}
                  onChange={handleEditChange}
                  placeholder="e.g. FitLife Gym"
                />
              </div>

              <div>
                <label className="db-label">Address</label>
                <input 
                  className="db-input" 
                  name="address"
                  value={editFormData.address || ''}
                  onChange={handleEditChange}
                  placeholder="e.g. 123 Main St"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="db-label">City</label>
                  <input 
                    className="db-input" 
                    name="city"
                    value={editFormData.city || ''}
                    onChange={handleEditChange}
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="db-label">State</label>
                  <input 
                    className="db-input" 
                    name="state"
                    value={editFormData.state || ''}
                    onChange={handleEditChange}
                    placeholder="State"
                  />
                </div>
              </div>

              <div>
                <label className="db-label">Contact Number</label>
                <input 
                  className="db-input" 
                  name="contactNumber"
                  value={editFormData.contactNumber || ''}
                  onChange={handleEditChange}
                  placeholder="Phone"
                />
              </div>

              <div>
                <label className="db-label">Email</label>
                <input 
                  className="db-input" 
                  name="email"
                  value={editFormData.email || ''}
                  onChange={handleEditChange}
                  placeholder="Email"
                />
              </div>

              <div>
                <label className="db-label">Opening Hours</label>
                <input 
                  className="db-input" 
                  name="openingHours"
                  value={editFormData.openingHours || ''}
                  onChange={handleEditChange}
                  placeholder="e.g. Mon-Sat 6AM-10PM"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="db-btn" onClick={handleEditClose} style={{ background: 'rgba(255,255,255,0.1)' }}>Cancel</button>
                <button 
                  type="submit" 
                  className="db-btn db-btn-primary" 
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Force Delete Modal */}
      {forceDeleteModal && (
        <div className="modal-overlay" style={{ zIndex: 2100 }}>
          <div className="modal-content" style={{ maxWidth: '400px', border: '1px solid #ef4444' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
               <div style={{ 
                 width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', 
                 color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' 
               }}>
                 <Icons.Delete />
               </div>
               <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '0.5rem' }}>Cannot Delete Gym</h3>
               <p style={{ color: 'var(--db-text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  This gym contains <strong>active members and trainers</strong>.
                  Standard deletion is blocked to prevent data loss.
               </p>
               <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '10px', marginTop: '1rem' }}>
                  <p style={{ color: '#ef4444', fontSize: '0.9rem', margin: 0, fontWeight: 600 }}>
                    Warning: Force deleting will permanently remove all active members and trainers associated with this gym.
                  </p>
               </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button 
                className="db-btn" 
                onClick={() => { setForceDeleteModal(false); setGymToDelete(null); }}
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                Cancel
              </button>
              <button 
                className="db-btn" 
                onClick={handleForceDelete}
                disabled={actionLoading}
                style={{ background: '#ef4444', color: '#fff', border: 'none' }}
              >
                {actionLoading ? 'Deleting...' : 'Force Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGymsPage;
