import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import FavoritesList from './FavoritesList';
import Watchlists from './Watchlists';
// import ReviewsList from './ReviewsList'; // If you have a reviews component

const API_URL = process.env.REACT_APP_API_URL || 'https://movie-recommendation-app-backend-equ7.onrender.com';

function Profile() {
  const { user } = useContext(AuthContext);
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
          // setUser(data); // User is now provided by AuthContext
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
    <div className="container py-5">
      <h1 className="fw-bold mb-4" style={{ fontSize: 40, color: '#222' }}>Your Dashboard</h1>
      <div className="row g-4">
        {/* Profile Card */}
        <div className="col-md-4">
          <div className="card p-4 rounded-4 shadow-sm h-100" style={{ background: '#f8fafc' }}>
            <h4 className="fw-bold mb-3">Profile</h4>
            <div className="mb-2"><b>Username:</b> <span className="text-secondary">{user.username}</span></div>
            <div className="mb-2"><b>Email:</b> <span className="text-secondary">{user.email}</span></div>
            {/* Add profile update form or avatar here if desired */}
          </div>
        </div>
        {/* Favorites Card */}
        <div className="col-md-4">
          <div className="card p-4 rounded-4 shadow-sm h-100" style={{ background: '#f8fafc' }}>
            <h4 className="fw-bold mb-3">Favorites</h4>
            <FavoritesList compact />
          </div>
        </div>
        {/* Watchlists Card */}
        <div className="col-md-4">
          <div className="card p-4 rounded-4 shadow-sm h-100" style={{ background: '#f8fafc' }}>
            <h4 className="fw-bold mb-3">Watchlists</h4>
            <Watchlists compact />
          </div>
        </div>
      </div>
      {/* Reviews Section (placeholder) */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card p-4 rounded-4 shadow-sm" style={{ background: '#f8fafc' }}>
            <h4 className="fw-bold mb-3">Your Reviews</h4>
            <div className="text-secondary">User reviews and review management coming soon.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
