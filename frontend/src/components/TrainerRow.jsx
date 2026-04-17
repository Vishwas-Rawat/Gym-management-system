import React from "react";
import { motion } from "framer-motion";
import '../styles/dashboard.css';

// Custom SVG Icons
const IconEye = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);
const IconEdit = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);
const IconSend = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/></svg>
);
const IconTrash = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
);
const IconFitness = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18c-2 0-4-2-4-4s2-4 4-4 4 2 4 4-2 4-4 4z"/><path d="M18 18c-2 0-4-2-4-4s2-4 4-4 4 2 4 4-2 4-4 4z"/><path d="M7 14h10"/><path d="M9 11l-2-2"/><path d="M17 11l2-2"/><path d="M9 17l-2 2"/><path d="M17 17l2 2"/></svg>
);

const buttonVariants = {
  hover: { scale: 1.15 },
  tap: { scale: 0.9 },
};

const TrainerRow = React.memo(
  ({ trainer, onDetail, onEdit, onResend, onDelete, isSelected }) => {
    const id = trainer.trainerId || trainer.id;

    return (
      <motion.tr
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
        onClick={onDetail}
        style={{
          cursor: "pointer",
          backgroundColor: isSelected ? 'rgba(var(--db-accent-rgb, 251, 146, 60), 0.05)' : 'transparent',
          transition: 'background-color 0.2s'
        }}
      >
        <td>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div className="avatar-sm" style={{ 
              backgroundColor: 'rgba(var(--db-accent-rgb, 251, 146, 60), 0.1)', 
              color: 'var(--db-accent)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <IconFitness />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--db-text-primary)' }}>{trainer.fullName}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--db-text-secondary)' }}>{trainer.email}</div>
            </div>
          </div>
        </td>

        <td>
          <div style={{ fontSize: "0.85rem", color: "var(--db-text-secondary)" }}>
            {trainer.phoneNo || trainer.phoneNumber || "—"}
          </div>
        </td>

        <td>
          <span className="db-badge badge-trainer db-badge-outline">
            {trainer.specialization || "General"}
          </span>
        </td>

        <td>
          <div style={{ fontSize: "0.85rem", color: "var(--db-text-secondary)" }}>
             {trainer.experienceYears ? `${trainer.experienceYears} Yrs` : "—"}
          </div>
        </td>

        <td>
          <div style={{ fontSize: "0.85rem", color: "var(--db-text-secondary)", fontWeight: 500 }}>
            {trainer.gymName || "—"}
          </div>
        </td>

        <td onClick={(e) => e.stopPropagation()}>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
            <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" 
              className="db-btn-icon" onClick={onDetail} title="View Details">
              <IconEye />
            </motion.button>

            <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" 
              className="db-btn-icon" onClick={onEdit} title="Edit Trainer">
              <IconEdit />
            </motion.button>

            <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" 
              className="db-btn-icon" onClick={onResend} title="Resend Invite" style={{ color: 'var(--db-blue)' }}>
              <IconSend />
            </motion.button>

            <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" 
              className="db-btn-icon btn-delete" onClick={onDelete} title="Delete Trainer">
              <IconTrash />
            </motion.button>
          </div>
        </td>
      </motion.tr>
    );
  }
);

export default TrainerRow;
