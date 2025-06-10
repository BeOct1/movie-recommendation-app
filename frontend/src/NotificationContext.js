import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const showNotification = useCallback((message, type = 'info', timeout = 3000) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications((prev) => prev.filter(n => n.id !== id)), timeout);
  }, []);
  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter(n => n.id !== id));
  };
  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      <div className="toast-history-container">
        {notifications.map(n => (
          <div key={n.id} className={`toast-notification toast-${n.type}`}> 
            {n.message}
            <button className="toast-dismiss-btn" onClick={() => dismissNotification(n.id)} aria-label="Dismiss notification">&times;</button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
