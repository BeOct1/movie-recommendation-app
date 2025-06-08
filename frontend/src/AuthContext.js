import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  // Refresh access token using refresh token cookie
  const refreshAccessToken = useCallback(async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        return data.token;
      } else {
        logout();
        return null;
      }
    } catch {
      logout();
      return null;
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      // Try to refresh on mount if no token
      refreshAccessToken();
    }
    if (isAuthenticated && !user) {
      fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/profile`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        credentials: 'include', // for HTTP-only cookies if backend supports
      })
        .then(res => res.json())
        .then(data => setUser(data))
        .catch(() => setUser(null));
    }
  }, [isAuthenticated, user, refreshAccessToken]);

  const login = (profile, token) => {
    setIsAuthenticated(true);
    setUser(profile);
    if (token) {
      localStorage.setItem('token', token);
      // Optionally, set cookie via backend Set-Cookie header
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    // Optionally, clear cookie via backend endpoint
    fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}
