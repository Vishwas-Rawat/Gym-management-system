import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/dashboard.css';

const ConfirmationDialog = ({ 
  open, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  severity = "warning" 
}) => {
  if (!open) return null;

  const getSeverityColor = () => {
    switch(severity) {
      case 'error': return '#ee5253';
      case 'info': return 'var(--db-accent)';
      case 'warning': return '#fbbf24';
      default: return 'var(--db-accent)';
    }
  };

  const getSeverityBg = () => {
    switch(severity) {
      case 'error': return 'rgba(238, 82, 83, 0.1)';
      case 'info': return 'rgba(var(--db-accent-rgb, 251, 146, 60), 0.1)';
      case 'warning': return 'rgba(251, 191, 36, 0.1)';
      default: return 'rgba(var(--db-accent-rgb, 251, 146, 60), 0.1)';
    }
  };

  const Icon = () => {
    switch(severity) {
      case 'error':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        );
      case 'warning':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        );
      default:
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        );
    }
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 40000,
          padding: '1.5rem'
        }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)'
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{
              width: '100%',
              maxWidth: '400px',
              backgroundColor: 'var(--db-sidebar)',
              borderRadius: '20px',
              padding: '2.5rem 2rem',
              position: 'relative',
              zIndex: 1,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              border: '1px solid var(--db-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: getSeverityBg(),
              color: getSeverityColor(),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem'
            }}>
              <Icon />
            </div>

            <h3 style={{ 
              margin: '0 0 0.75rem 0', 
              fontSize: '1.5rem', 
              fontWeight: 800, 
              color: 'var(--db-text-primary)' 
            }}>
              {title}
            </h3>

            <p style={{ 
              margin: '0 0 2rem 0', 
              fontSize: '1rem', 
              lineHeight: 1.6, 
              color: 'var(--db-text-secondary)',
              opacity: 0.9
            }}>
              {message}
            </p>

            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
              <button 
                onClick={onCancel}
                className="db-btn"
                style={{ 
                  flex: 1, 
                  backgroundColor: 'transparent',
                  border: '1px solid var(--db-border)',
                  color: 'var(--db-text-primary)',
                  fontWeight: 600
                }}
              >
                {cancelText}
              </button>
              <button 
                onClick={onConfirm}
                className="db-btn db-btn-primary"
                style={{ 
                  flex: 1,
                  backgroundColor: severity === 'error' ? '#ee5253' : 'var(--db-accent)',
                  fontWeight: 600,
                  boxShadow: 'none'
                }}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ConfirmationDialog;
