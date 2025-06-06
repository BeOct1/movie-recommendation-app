import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'https://movie-recommendation-app-backend-equ7.onrender.com';

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/api/auth/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          setError(data.message || 'Failed to fetch profile');
        }
      } catch (err) {
        setError('Server error');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <div className="alert alert-danger mt-4 container" style={{maxWidth: 500}}>{error}</div>;
  if (!user) return <div className="container mt-4">Loading profile...</div>;

  return (
    <div className="container mt-4" style={{maxWidth: 500}}>
      <h2>User Profile</h2>
      <div className="card p-3">
        <p><b>Username:</b> {user.username}</p>
        <p><b>Email:</b> {user.email}</p>
      </div>
    </div>
  );
}

export default Profile;
