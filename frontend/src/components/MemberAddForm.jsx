import React, { useState, useEffect, useCallback, useMemo } from "react";
// SVG Icons
const IconPlus = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const IconTrash = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
);
const IconFitness = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18c-2 0-4-2-4-4s2-4 4-4 4 2 4 4-2 4-4 4z"/><path d="M18 18c-2 0-4-2-4-4s2-4 4-4 4 2 4 4-2 4-4 4z"/><path d="M7 14h10"/><path d="M9 11l-2-2"/><path d="M17 11l2-2"/><path d="M9 17l-2 2"/><path d="M17 17l2 2"/></svg>
);
const IconClose = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const IconChevronDown = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
);
import { useNavigate } from "react-router-dom";
import { userApi } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import '../styles/dashboard.css';

const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = ["00", "15", "30", "45"];
const ampm = ["AM", "PM"];
const paymentMethods = ["CASH", "ONLINE", "UPI", "CARD", "NETBANKING"];

const emptyMember = {
  fullName: "", email: "", phoneNo: "", monthsPaid: "", monthsFree: "",
  workoutTimeSlot: "", registrationFee: "", planPrice: "", discount: "",
  paymentMethod: "CASH", joiningDate: new Date().toISOString().split("T")[0],
};

export default function MemberAddForm({ onSuccess, multiple = false, member = null, onCancel }) {
  const navigate = useNavigate();
  const isEdit = !!member;

  const [members, setMembers] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [globalGymId, setGlobalGymId] = useState("");
  const [gymOptions, setGymOptions] = useState([]);
  const [loadingGyms, setLoadingGyms] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // ✅ Added state
  const dropdownRef = React.useRef(null); // ✅ Added ref

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

  useEffect(() => {
    if (isEdit && member) {
      setMembers([{
        ...emptyMember,
        fullName: member.fullName ?? "",
        email: member.email ?? "",
        phoneNo: member.phoneNo || member.phoneNumber || "",
        monthsPaid: member.monthsPaid?.toString() ?? "",
        monthsFree: member.monthsFree?.toString() ?? "0",
        workoutTimeSlot: member.workoutTimeSlot || "",
        registrationFee: member.registrationFee?.toString() ?? "",
        planPrice: member.planPrice?.toString() ?? "",
        discount: member.discount?.toString() ?? "",
        paymentMethod: member.paymentMethod ?? "CASH",
        joiningDate: member.joiningDate || member.startDate || "",
      }]);
      setGlobalGymId(member.gymId ? String(member.gymId) : "");
    } else {
      setMembers([emptyMember]);
      setGlobalGymId("");
    }
  }, [isEdit, member]);

  useEffect(() => {
    setMembers(prev => prev.map(m => ({ ...m, gymId: globalGymId })));
  }, [globalGymId]);

  // Removed automatic totalAmount calculation as it's not needed for the payload


  const handleChange = useCallback((idx, field, value) => {
    setMembers(prev => {
      const copy = [...prev];
      copy[idx][field] = value;
      return copy;
    });
  }, []);

  const submit = useCallback(() => {
    if (!globalGymId) return alert("Please select a gym.");
    const payload = members.map(m => {
      return {
        fullName: m.fullName,
        email: m.email,
        phoneNo: m.phoneNo,
        gymId: Number(globalGymId),
        workoutTimeSlot: m.workoutTimeSlot,
        monthsPaid: Number(m.monthsPaid || 0),
        monthsFree: Number(m.monthsFree || 0),
        registrationFee: Number(m.registrationFee || 0),
        planPrice: Number(m.planPrice || 0),
        discount: Number(m.discount || 0),
        paymentMethod: m.paymentMethod,
        joiningDate: m.joiningDate,
      };
    });
    onSuccess(isEdit ? { id: member.id, ...payload[0] } : (multiple || members.length > 1 ? payload : payload[0]));
  }, [globalGymId, members, multiple, onSuccess, isEdit, member]);

  const current = members[activeIdx] || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Gym Select Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
        <div className="db-form-group">
          <label className="db-label" style={{ marginBottom: '0.4rem' }}>Target Gym</label>
          <div className="db-select-wrapper no-after" ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
             {/* Custom Dropdown Trigger */}
             <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                    width: '100%',
                    padding: '0.85rem 1rem',
                    backgroundColor: 'var(--db-card)',
                    border: '1px solid var(--db-border)',
                    borderRadius: '10px',
                    color: 'var(--db-text-primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    transition: 'all 0.2s',
                    boxShadow: isDropdownOpen ? '0 0 0 2px rgba(var(--db-accent-rgb, 251, 146, 60), 0.2)' : 'none'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(var(--db-accent-rgb, 251, 146, 60), 0.02)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--db-card)'}
             >
                <span style={{ color: globalGymId ? 'var(--db-text-primary)' : 'var(--db-text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {globalGymId ? (gymOptions.find(g => g.id.toString() === globalGymId.toString())?.name || 'Selected Gym') : (loadingGyms ? "Loading..." : "Select Gym")}
                </span>
                <div style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'flex', opacity: 0.7 }}>
                    <IconChevronDown />
                </div>
             </div>

             {/* Dropdown Menu */}
             <AnimatePresence>
                {isDropdownOpen && !loadingGyms && (
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
                            borderRadius: '12px',
                            overflow: 'hidden',
                            zIndex: 105,
                            boxShadow: 'var(--glass-shadow)',
                            padding: '4px',
                            maxHeight: '200px',
                            overflowY: 'auto'
                        }}
                    >
                        {gymOptions.map(g => (
                            <div 
                                key={g.id}
                                onClick={() => { setGlobalGymId(g.id); setIsDropdownOpen(false); }}
                                className="dropdown-item"
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    color: globalGymId == g.id ? '#fff' : 'var(--db-text-primary)',
                                    backgroundColor: globalGymId == g.id ? 'var(--db-accent)' : 'transparent',
                                    fontWeight: globalGymId == g.id ? '600' : '500',
                                    fontSize: '0.85rem',
                                    marginBottom: '2px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                                onMouseEnter={(e) => {
                                    if(globalGymId != g.id) {
                                        e.currentTarget.style.backgroundColor = 'rgba(var(--db-accent-rgb, 251, 146, 60), 0.08)';
                                        e.currentTarget.style.color = 'var(--db-accent)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if(globalGymId != g.id) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = 'var(--db-text-primary)';
                                    }
                                }}
                            >
                                {g.name}
                            </div>
                        ))}
                    </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>
        <button className="db-btn db-btn-outline" onClick={() => navigate("/gym-register")} style={{ width: '100%', height: '42px', padding: '0 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
           <IconFitness /> Create New Gym
        </button>
      </div>

      {/* Multiple Members Tabs */}
      {multiple && (
        <div className="db-form-tabs" style={{ marginBottom: '-0.5rem' }}>
            {members.map((m, idx) => (
                <div key={idx} className={`db-form-tab ${activeIdx === idx ? 'active' : ''}`} 
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', minHeight: '36px' }}
                    onClick={() => setActiveIdx(idx)}>
                    <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {m.fullName || `Member ${idx+1}`}
                    </span>
                    {members.length > 1 && <div style={{ marginLeft: '6px', opacity: 0.6, display: 'flex' }} onClick={(e) => { e.stopPropagation(); setMembers(prev => prev.filter((_, i) => i !== idx)); setActiveIdx(0); }}><IconClose /></div>}
                </div>
            ))}
            <button className="db-btn-add-tab" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => { setMembers(prev => [...prev, {...emptyMember, gymId: globalGymId}]); setActiveIdx(members.length); }}>
                <IconPlus />
            </button>
        </div>
      )}

      {/* Member Data Form */}
      <div className="db-card" style={{ padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.01)' }}>
          <h4 className="db-form-section-title">Personal Details</h4>
          <div className="db-form-grid">
              <div className="db-form-group">
                  <label className="db-label">Full Name</label>
                  <input className="db-input" value={current.fullName} onChange={e => handleChange(activeIdx, "fullName", e.target.value)} placeholder="Enter name" />
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
          <h4 className="db-form-section-title">Membership & Timing</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="db-form-group">
                  <label className="db-label">Months Paid</label>
                  <input className="db-input" type="number" value={current.monthsPaid} onChange={e => handleChange(activeIdx, "monthsPaid", e.target.value)} />
              </div>
              <div className="db-form-group">
                  <label className="db-label">Months Free</label>
                  <input className="db-input" type="number" value={current.monthsFree} onChange={e => handleChange(activeIdx, "monthsFree", e.target.value)} />
              </div>
          </div>

          <div className="db-form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="db-label">Joining Date</label>
              <input className="db-input" type="date" value={current.joiningDate} onChange={e => handleChange(activeIdx, "joiningDate", e.target.value)} />
          </div>

          <div className="db-form-group">
              <label className="db-label">Workout Time Slot</label>
              <input className="db-input" value={current.workoutTimeSlot} onChange={e => handleChange(activeIdx, "workoutTimeSlot", e.target.value)} placeholder="e.g. 06:00 AM - 08:00 AM" />
          </div>

          <div className="db-divider" />
          <h4 className="db-form-section-title">Billing Information</h4>
          <div className="db-form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
              <div className="db-form-group">
                  <label className="db-label">Registration</label>
                  <input className="db-input" type="number" value={current.registrationFee} onChange={e => handleChange(activeIdx, "registrationFee", e.target.value)} />
              </div>
              <div className="db-form-group">
                  <label className="db-label">Plan Price</label>
                  <input className="db-input" type="number" value={current.planPrice} onChange={e => handleChange(activeIdx, "planPrice", e.target.value)} />
              </div>
              <div className="db-form-group">
                  <label className="db-label">Discount</label>
                  <input className="db-input" type="number" value={current.discount} onChange={e => handleChange(activeIdx, "discount", e.target.value)} />
              </div>
          </div>
          <div className="db-form-group">
              <label className="db-label">Payment Mode</label>
              <div className="db-select-wrapper no-after" style={{ position: 'relative' }}>
                  <select className="db-select" value={current.paymentMethod} onChange={e => handleChange(activeIdx, "paymentMethod", e.target.value)}>
                      {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
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

      {/* Form Actions */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button className="db-btn db-btn-outline" style={{ flex: 1 }} onClick={onCancel}>Cancel</button>
          <button className="db-btn db-btn-primary" style={{ flex: 2 }} onClick={submit}>
            {isEdit ? "Update Member" : "Register Member"}
          </button>
      </div>
    </div>
  );
}
