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
const IconMoney = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);
const IconTrash = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
);
const IconPerson = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const buttonVariants = {
  hover: { scale: 1.15 },
  tap: { scale: 0.9 },
};

const MemberRow = React.memo(
  ({ member, gymName, onDetail, onEdit, onPaymentReminder, onDelete, isSelected }) => {
    const planText =
      member.membershipPlan ||
      (member.monthsPaid
        ? `${member.monthsPaid} mo${member.monthsPaid > 1 ? "s" : ""}${
            member.monthsFree ? ` + ${member.monthsFree} free` : ""
          }`
        : "—");

    const timing = member.workoutTimeSlot || member.timing || "—";
    const id = member.memberId || member.id || member.gymMemberId;

    return (
      <motion.tr
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
        className={isSelected ? "member-row-selected" : ""}
        onClick={onDetail}
        style={{
          cursor: "pointer",
          backgroundColor: isSelected ? 'rgba(var(--db-accent-rgb, 251, 146, 60), 0.05)' : 'transparent',
          transition: 'background-color 0.2s'
        }}
      >
        <td style={{ width: '35%' }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div className="avatar-sm" style={{ 
              backgroundColor: 'rgba(var(--db-accent-rgb, 251, 146, 60), 0.1)', 
              color: 'var(--db-accent)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <IconPerson />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--db-text-primary)' }}>{member.fullName}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--db-text-secondary)' }}>{member.email}</div>
              {gymName && (
                <div style={{ fontSize: '0.7rem', color: 'var(--db-accent)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                   <span style={{opacity: 0.7}}>Gym:</span> {gymName}
                </div>
              )}
            </div>
          </div>
        </td>

        <td data-label="Phone">
          <div style={{ fontSize: "0.85rem", color: "var(--db-text-secondary)" }}>
            {member.phoneNo || member.phoneNumber || "—"}
          </div>
        </td>

        <td data-label="Plan">
          <span className="db-badge badge-member db-badge-outline">
            {planText}
          </span>
        </td>

        <td data-label="Timing">
          <div style={{ fontSize: "0.85rem", color: "var(--db-text-secondary)" }}>{timing}</div>
        </td>

        <td onClick={(e) => e.stopPropagation()}>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
            <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" 
              className="db-btn-icon" onClick={onDetail} title="View Details">
              <IconEye />
            </motion.button>

            <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" 
              className="db-btn-icon" onClick={onEdit} title="Edit Member">
              <IconEdit />
            </motion.button>

            <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" 
              className="db-btn-icon" onClick={onPaymentReminder} title="Payment Reminder" style={{ color: 'var(--db-green)' }}>
              <IconMoney />
            </motion.button>

            <motion.button variants={buttonVariants} whileHover="hover" whileTap="tap" 
              className="db-btn-icon btn-delete" onClick={onDelete} title="Delete Member">
              <IconTrash />
            </motion.button>
          </div>
        </td>
      </motion.tr>
    );
  }
);

export default MemberRow;
