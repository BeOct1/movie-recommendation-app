import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export function useNotification() {
  return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null);
  const showNotification = useCallback((message, type = 'info', timeout = 3000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), timeout);
  }, []);

  return (
    <NotificationContext.Provider value={showNotification}>
      {children}
      {notification && (
        <div className={`toast-notification toast-${notification.type}`}>{notification.message}</div>
      )}
    </NotificationContext.Provider>
  );
}
