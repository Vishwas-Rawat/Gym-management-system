import { motion } from "framer-motion";
import '../styles/dashboard.css';

// Custom SVG Icons
const IconClose = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);
const IconUser = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const IconPhone = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
);
const IconEmail = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
);
const IconCalendar = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
);
const IconWork = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);
const IconClock = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const IconMoney = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);

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
    <div className="detail-info-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {Icon && <Icon />} {label}
    </div>
    <div className={`detail-info-value ${highlight ? 'highlight' : ''}`}>
      {value || "—"}
    </div>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const TrainerDetailView = ({ trainer, onClose, onAssignMembers, style }) => {
  if (!trainer) return null;

  return (
    <div className="detail-view-container" style={style}>
      {/* Header */}
      <div className="detail-view-header">
        <h3 className="detail-view-title">Trainer Profile</h3>
        {onClose && (
          <button className="detail-close-btn" onClick={onClose}>
            <IconClose />
          </button>
        )}
      </div>

      <div className="detail-view-content">
        {/* Personal Information */}
        <motion.div variants={itemVariants} className="detail-section">
          <SectionHeader icon={IconUser} title="Personal Information" />
          <div className="detail-card">
              <InfoRow label="Full Name" value={trainer.fullName} />
              <InfoRow label="Email" value={trainer.email} icon={IconEmail} />
              <InfoRow label="Phone" value={trainer.phoneNo || trainer.phoneNumber} icon={IconPhone} />
          </div>
        </motion.div>

        {/* Professional Info */}
        <motion.div variants={itemVariants} className="detail-section">
          <SectionHeader icon={IconWork} title="Professional Info" />
          <div className="detail-card">
            <div className="detail-info-row">
              <div className="detail-stat-item">
                <span className="detail-info-label">Specialization</span>
                <span className="db-badge db-badge-success">{trainer.specialization || "General"}</span>
              </div>
              <div className="detail-stat-item" style={{ textAlign: 'right' }}>
                <span className="detail-info-label">Status</span>
                <span className="db-badge db-badge-outline">{(trainer.status || "FULL_TIME").replace("_", " ")}</span>
              </div>
            </div>
            
            <div className="detail-divider-dashed" />
            
            <div className="detail-stats-row">
              <div className="detail-stat-item">
                <span className="detail-info-label">Experience</span>
                <span className="detail-stat-value">{trainer.experienceYears || 0} Years</span>
              </div>
              <div className="detail-stat-item">
                <span className="detail-info-label">Gym</span>
                <span className="detail-stat-value" style={{ fontSize: '1rem' }}>{trainer.gym?.gymName || trainer.gymName || "—"}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Availability & Salary */}
        <motion.div variants={itemVariants} className="detail-section">
          <SectionHeader icon={IconClock} title="Availability & Salary" />
          <div className="detail-card">
              <InfoRow label="Availability" value={trainer.availability} icon={IconClock} />
              <div className="detail-divider-dashed" />
              <div className="detail-payment-total">
                <span className="total-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <IconMoney /> Monthly Salary
                </span>
                <span className="total-value">
                  ₹{Number(trainer.salary || 0).toLocaleString()}
                </span>
              </div>
          </div>
        </motion.div>

        {/* Record Info */}
        <motion.div variants={itemVariants} className="detail-section">
          <SectionHeader icon={IconCalendar} title="Record Info" />
          <div className="detail-card record-info">
            <div className="detail-stats-row">
              <div className="detail-stat-item">
                <span className="detail-info-label">Created At</span>
                <span className="detail-record-timestamp">
                  {trainer.createdAt ? new Date(trainer.createdAt).toLocaleString() : "—"}
                </span>
              </div>
              <div className="detail-stat-item">
                <span className="detail-info-label">Updated At</span>
                <span className="detail-record-timestamp">
                  {trainer.updatedAt ? new Date(trainer.updatedAt).toLocaleString() : "—"}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {onClose && (
        <div className="detail-view-footer" style={{ display: 'flex', gap: '1rem' }}>
          <button className="db-btn db-btn-outline" style={{ flex: 1 }} onClick={onAssignMembers}>
            Assign Members
          </button>
          <button className="db-btn db-btn-primary" style={{ flex: 1 }} onClick={onClose}>
            Close Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default TrainerDetailView;
