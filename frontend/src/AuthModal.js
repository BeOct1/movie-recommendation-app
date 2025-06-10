import React from 'react';

export default function AuthModal({ show, onClose, children }) {
  if (!show) return null;
  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-card">
        <button className="auth-modal-close" onClick={onClose} aria-label="Close">&times;</button>
        {children}
      </div>
    </div>
  );
}
