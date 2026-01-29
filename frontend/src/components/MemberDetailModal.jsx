import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import '../styles/dashboard.css';

// Custom SVG Icon Components (Lucide-inspired)
const Icons = {
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Calendar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Payment: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  Person: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Phone: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Email: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Assignment: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" />
    </svg>
  ),
  CreditCard: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  Event: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
};

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="detail-section-header">
    <div className="detail-icon-box">
        <Icon />
    </div>
    <span className="detail-section-title">{title}</span>
  </div>
);

const InfoRow = ({ label, value, icon: Icon, highlight = false }) => (
  <div className="detail-info-row">
    <div className="detail-info-label">
      {Icon && <Icon />} {label}
    </div>
    <div className={`detail-info-value ${highlight ? 'highlight' : ''}`}>
      {value || "—"}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Helper – normalises the two possible shapes we receive            */
/* ------------------------------------------------------------------ */
const normaliseMember = (raw) => {
  if (!raw) return {};
  if (raw.message) return raw;

  return {
    ...raw,
    registrationFee: Number(raw.registrationFee || 0),
    planPrice: Number(raw.planPrice || 0),
    discount: Number(raw.discount || 0),
    totalPaid: Number(raw.totalAmount || raw.totalPaid || 0),
    monthsPaid: Number(raw.monthsPaid || 0),
    monthsFree: Number(raw.monthsFree || 0),
  };
};

const containerVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 15, filter: "blur(4px)" },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    filter: "blur(0px)",
    transition: { 
      type: "spring",
      stiffness: 260,
      damping: 26,
      mass: 1,
      staggerChildren: 0.06,
      delayChildren: 0.2
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.96, 
    y: 15, 
    filter: "blur(4px)",
    transition: { duration: 0.2, ease: "easeOut" } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10, filter: "blur(2px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
};

export const MemberDetailView = ({ member: rawMember, onClose, style }) => {
  if (!rawMember) return null;

  const member = normaliseMember(rawMember);

  const formatDateOnly = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const timing = member.timing || member.workoutTimeSlot || "Not set";
  const planText = member.membershipPlan || (member.monthsPaid ? `${member.monthsPaid} Months` : "—");

  return (
    <div className="detail-view-container" style={style}>
      {/* Header */}
      <div className="detail-view-header">
        <h3 className="detail-view-title">Member Profile</h3>
        {onClose && (
          <button className="detail-close-btn" onClick={onClose}>
            <Icons.Close />
          </button>
        )}
      </div>

      <div className="detail-view-content">
        {/* Personal Information */}
        <motion.div variants={itemVariants} className="detail-section">
          <SectionHeader icon={Icons.Person} title="Personal Information" />
          <div className="detail-card">
              <InfoRow label="Full Name" value={member.fullName} />
              <InfoRow label="Email" value={member.email} icon={Icons.Email} />
              <InfoRow label="Phone" value={member.phoneNo || member.phoneNumber} icon={Icons.Phone} />

              {/* Assigned Trainer */}
              <div className="detail-assigned-box">
                 <div className="detail-assigned-info">
                    <span className="detail-info-label">Assigned Trainer</span>
                    <span className="detail-assigned-name">
                        {member.trainerName || member.trainer?.fullName || "No Trainer Assigned"}
                    </span>
                 </div>
                 <button 
                    className="detail-manage-btn"
                    onClick={() => window.location.href = '/admin/assignments'}
                 >
                    <Icons.Assignment />
                    Manage
                 </button>
              </div>
          </div>
        </motion.div>

        {/* Membership Plan */}
        <motion.div variants={itemVariants} className="detail-section">
          <SectionHeader icon={Icons.Calendar} title="Membership Plan" />
          <div className="detail-card">
            <div className="detail-info-row">
              <span className="detail-info-label">Current Plan</span>
              <span className="db-badge db-badge-success">{planText}</span>
            </div>
            <div className="detail-stats-row">
              <div className="detail-stat-item">
                <span className="detail-info-label">Months Paid</span>
                <span className="detail-stat-value">{member.monthsPaid || 0}</span>
              </div>
              <div className="detail-stat-item">
                <span className="detail-info-label">Months Free</span>
                <span className="detail-stat-value">{member.monthsFree || 0}</span>
              </div>
            </div>
            <InfoRow label="Start Date" value={formatDateOnly(member.startDate)} icon={Icons.Event} />
          </div>
        </motion.div>

        {/* Workout Timing */}
        <motion.div variants={itemVariants} className="detail-section">
          <SectionHeader icon={Icons.Clock} title="Workout Timing" />
          <div className="detail-timing-card">
            {timing}
          </div>
        </motion.div>

        {/* Payment Details */}
        <motion.div variants={itemVariants} className="detail-section">
          <SectionHeader icon={Icons.Payment} title="Payment Details" />
          <div className="detail-card">
              <div className="detail-payment-item">
                <span className="detail-info-label">Registration Fee</span>
                <span className="detail-payment-value">₹{member.registrationFee?.toFixed(2)}</span>
              </div>
              <div className="detail-payment-item">
                <span className="detail-info-label">Plan Price</span>
                <span className="detail-payment-value">₹{member.planPrice?.toFixed(2)}</span>
              </div>
              <div className="detail-payment-item">
                <span className="detail-info-label">Discount</span>
                <span className="detail-payment-value discount">-₹{member.discount?.toFixed(2)}</span>
              </div>
              <div className="detail-divider-dashed" />
              <div className="detail-payment-total">
                <span className="total-label">Total Paid</span>
                <span className="total-value">₹{member.totalPaid?.toFixed(2)}</span>
              </div>
              <InfoRow label="Payment Method" value={member.paymentMethod} icon={Icons.CreditCard} />
          </div>
        </motion.div>

        {/* Record Info */}
        <motion.div variants={itemVariants} className="detail-section">
          <SectionHeader icon={Icons.Event} title="Record Info" />
          <div className="detail-card record-info">
            <div className="detail-stats-row">
              <div className="detail-stat-item">
                <span className="detail-info-label">Created At</span>
                <span className="detail-record-timestamp">
                  {new Date(member.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="detail-stat-item">
                <span className="detail-info-label">Updated At</span>
                <span className="detail-record-timestamp">
                  {new Date(member.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {onClose && (
        <div className="detail-view-footer">
          <button className="db-btn db-btn-primary" onClick={onClose} style={{ width: '100%' }}>
            Close Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default function MemberDetailModal({ open, onClose, member }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="db-modal-overlay" onClick={onClose}>
          <motion.div 
            className="db-modal-container detail-modal"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={e => e.stopPropagation()}
          >
            <MemberDetailView member={member} onClose={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}