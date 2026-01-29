import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { userApi } from "../services/api";

// Custom SVG Icons
const IconPlus = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const IconClose = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const IconFitness = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18c-2 0-4-2-4-4s2-4 4-4 4 2 4 4-2 4-4 4z"/><path d="M18 18c-2 0-4-2-4-4s2-4 4-4 4 2 4 4-2 4-4 4z"/><path d="M7 14h10"/><path d="M9 11l-2-2"/><path d="M17 11l2-2"/><path d="M9 17l-2 2"/><path d="M17 17l2 2"/></svg>
);
const IconChevronDown = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
);
import '../styles/dashboard.css';

const statuses = ["FULL_TIME", "PART_TIME", "CONTRACT", "ON_LEAVE"];

const emptyTrainer = {
  fullName: "",
  email: "",
  phoneNo: "",
  specialization: "",
  experienceYears: "",
  availability: "",
  salary: "",
  status: "FULL_TIME",
};

export default function TrainerAddForm({ onSuccess, multiple = false, trainer = null, onCancel }) {
  const navigate = useNavigate();
  const isEdit = !!trainer;

  const [trainers, setTrainers] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [globalGymId, setGlobalGymId] = useState("");
  const [gymOptions, setGymOptions] = useState([]);
  const [loadingGyms, setLoadingGyms] = useState(true);

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        setLoadingGyms(true);
        const response = await userApi.get("/gym/my-gyms");
        const gyms = Array.isArray(response.data) ? response.data : [];
        setGymOptions(gyms.map(g => ({ id: g.gymId, name: g.gymName })));
      } catch {
        setGymOptions([]);
      } finally {
        setLoadingGyms(false);
      }
    };
    fetchGyms();
  }, []);

  useEffect(() => {
    if (isEdit && trainer) {
      const init = {
        ...emptyTrainer,
        fullName: trainer.fullName ?? "",
        email: trainer.email ?? "",
        phoneNo: trainer.phoneNo || trainer.phoneNumber || "",
        specialization: trainer.specialization ?? "",
        experienceYears: trainer.experienceYears ?? "",
        availability: trainer.availability ?? "",
        salary: trainer.salary ?? "",
        status: trainer.status ?? "FULL_TIME",
      };
      setTrainers([init]);
      const gId = trainer.gymId || trainer.gym?.gymId;
      if (gId) setGlobalGymId(String(gId));
    } else {
      setTrainers([emptyTrainer]);
      setGlobalGymId("");
    }
  }, [isEdit, trainer]);

  useEffect(() => {
    setTrainers(prev => prev.map(t => ({ ...t, gymId: globalGymId })));
  }, [globalGymId]);

  const handleChange = useCallback((idx, field, value) => {
    setTrainers(prev => {
      const copy = [...prev];
      copy[idx][field] = value;
      return copy;
    });
  }, []);

  const submit = useCallback(() => {
    if (!globalGymId) return alert("Please select a gym.");
    const final = trainers.map(t => ({
      fullName: t.fullName,
      email: t.email,
      phoneNo: t.phoneNo,
      gymId: Number(globalGymId),
      specialization: t.specialization,
      experienceYears: Number(t.experienceYears || 0),
      availability: t.availability,
      salary: Number(t.salary || 0),
      status: t.status,
    }));
    onSuccess(isEdit ? { trainerId: trainer.id || trainer.trainerId, ...final[0] } : (multiple || trainers.length > 1 ? final : final[0]));
  }, [globalGymId, trainers, multiple, onSuccess, isEdit, trainer]);

  const current = trainers[activeIdx] || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Gym Select Section */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
        <div className="db-form-group" style={{ flex: 1 }}>
          <label className="db-label" style={{ marginBottom: '0.4rem' }}>Target Gym</label>
          <div className="db-select-wrapper no-after">
             <select className="db-select" 
                value={globalGymId} 
                onChange={e => setGlobalGymId(e.target.value)}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  width: '100%',
                  color: 'var(--db-text-primary)'
                }}
             >
                <option value="" disabled style={{ backgroundColor: 'var(--db-card)' }}>{loadingGyms ? "Loading..." : "Select Gym"}</option>
                {gymOptions.map(g => <option key={g.id} value={g.id} style={{ backgroundColor: 'var(--db-card)' }}>{g.name}</option>)}
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
        </div>
        <button className="db-btn db-btn-outline" onClick={() => navigate("/gym-register")} style={{ height: '42px', padding: '0 1.5rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <IconFitness /> Create New Gym
        </button>
      </div>

      {/* Multiple Trainers Tabs */}
      {multiple && (
        <div className="db-form-tabs">
            {trainers.map((t, idx) => (
                <div key={idx} className={`db-form-tab ${activeIdx === idx ? 'active' : ''}`} onClick={() => setActiveIdx(idx)}>
                    {t.fullName || `Trainer ${idx+1}`}
                    {trainers.length > 1 && (
                        <span style={{ marginLeft: '8px', cursor: 'pointer', display: 'flex' }} onClick={(e) => { e.stopPropagation(); setTrainers(prev => prev.filter((_, i) => i !== idx)); setActiveIdx(0); }}>
                            <IconClose />
                        </span>
                    )}
                </div>
            ))}
            <button className="db-btn-add-tab" onClick={() => { setTrainers(prev => [...prev, {...emptyTrainer, gymId: globalGymId}]); setActiveIdx(trainers.length); }}>
                <IconPlus />
            </button>
        </div>
      )}

      {/* Trainer Data Form */}
      <div className="db-card" style={{ padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.01)' }}>
          <h4 className="db-form-section-title">Personal Details</h4>
          <div className="db-form-grid">
              <div className="db-form-group">
                  <label className="db-label">Full Name</label>
                  <input className="db-input" value={current.fullName} onChange={e => handleChange(activeIdx, "fullName", e.target.value)} placeholder="Full Name" />
              </div>
              <div className="db-form-group">
                  <label className="db-label">Email Address</label>
                  <input className="db-input" type="email" value={current.email} onChange={e => handleChange(activeIdx, "email", e.target.value)} placeholder="Email" />
              </div>
              <div className="db-form-group">
                  <label className="db-label">Phone Number</label>
                  <input className="db-input" value={current.phoneNo} onChange={e => handleChange(activeIdx, "phoneNo", e.target.value)} placeholder="10-digit #" />
              </div>
          </div>

          <div className="db-divider" />
          <h4 className="db-form-section-title">Professional Profile</h4>
          <div className="db-form-grid">
              <div className="db-form-group">
                  <label className="db-label">Specialization</label>
                  <input className="db-input" value={current.specialization} onChange={e => handleChange(activeIdx, "specialization", e.target.value)} placeholder="e.g. Yoga, Crossfit" />
              </div>
              <div className="db-form-group">
                  <label className="db-label">Experience (Years)</label>
                  <input className="db-input" type="number" value={current.experienceYears} onChange={e => handleChange(activeIdx, "experienceYears", e.target.value)} placeholder="0" />
              </div>
          </div>
          
          <div className="db-form-group">
              <label className="db-label">Availability Schedule</label>
              <input className="db-input" value={current.availability} onChange={e => handleChange(activeIdx, "availability", e.target.value)} placeholder="e.g. Mon-Fri 6AM-10AM" />
          </div>

          <div className="db-divider" />
          <h4 className="db-form-section-title">Employment Information</h4>
          <div className="db-form-grid">
              <div className="db-form-group">
                  <label className="db-label">Monthly Salary (₹)</label>
                  <input className="db-input" type="number" value={current.salary} onChange={e => handleChange(activeIdx, "salary", e.target.value)} placeholder="0" />
              </div>
              <div className="db-form-group">
                  <label className="db-label">Employment Status</label>
                  <div className="db-select-wrapper no-after" style={{ position: 'relative' }}>
                      <select className="db-select" value={current.status} onChange={e => handleChange(activeIdx, "status", e.target.value)}>
                          {statuses.map(s => <option key={s} value={s} style={{ backgroundColor: 'var(--db-card)' }}>{s.replace("_", " ")}</option>)}
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
              </div>
          </div>
      </div>

      {/* Form Actions */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button className="db-btn db-btn-outline" style={{ flex: 1 }} onClick={onCancel}>Cancel</button>
          <button className="db-btn db-btn-primary" style={{ flex: 2 }} onClick={submit}>
            {isEdit ? "Update Trainer" : "Register Trainer"}
          </button>
      </div>
    </div>
  );
}
