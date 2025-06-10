import React, { useEffect, useRef } from 'react';

export default function AuthModal({ show, onClose, children }) {
  const modalRef = useRef();
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (show) {
      previouslyFocused.current = document.activeElement;
      modalRef.current?.focus();
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
        // Trap focus
        if (e.key === 'Tab') {
          const focusable = modalRef.current.querySelectorAll('input,button,select,textarea,a[href],.btn');
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        previouslyFocused.current?.focus();
      };
    }
  }, [show, onClose]);

  if (!show) return null;
  return (
    <div className="auth-modal-overlay" role="dialog" aria-modal="true" aria-label="Authentication Dialog">
      <div className="auth-modal-card" ref={modalRef} tabIndex="-1">
        <button className="auth-modal-close" onClick={onClose} aria-label="Close">&times;</button>
        {children}
      </div>
    </div>
  );
}
