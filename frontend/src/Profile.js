import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import FavoritesList from './FavoritesList';
import Watchlists from './Watchlists';
import ReviewsList from './ReviewsList';

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
    <div className="profile-container">
      <form className="profile-form mb-4" onSubmit={handleUpdate} aria-label="Update profile">
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <label htmlFor="profile-username" className="form-label">Username</label>
            <input
              id="profile-username"
              className="form-control"
              value={profile.username}
              onChange={e => setProfile({ ...profile, username: e.target.value })}
              aria-label="Username"
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="profile-email" className="form-label">Email</label>
            <input
              id="profile-email"
              className="form-control"
              value={profile.email}
              onChange={e => setProfile({ ...profile, email: e.target.value })}
              aria-label="Email"
              required
            />
          </div>
        </div>
        <button className="btn btn-primary mt-3" type="submit" style={{ minHeight: 44, minWidth: 44 }}>Update Profile</button>
        {message && <div className="mt-2 text-success" role="status">{message}</div>}
      </form>
      <div className="profile-sections-grid">
        <section aria-label="Favorites">
          <h5 className="fw-bold mb-2">Favorites</h5>
          <FavoritesList compact={false} />
        </section>
        <section aria-label="Watchlists">
          <h5 className="fw-bold mb-2">Watchlists</h5>
          <Watchlists compact={false} />
        </section>
        <section aria-label="Reviews">
          <h5 className="fw-bold mb-2">Reviews</h5>
          <ReviewsList userId={profile._id} />
        </section>
      </div>
      <style>{`
        .profile-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem;
        }
        .profile-form {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          padding: 2rem 1.5rem;
        }
        .profile-sections-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-top: 2rem;
        }
        @media (min-width: 900px) {
          .profile-sections-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .btn-primary {
          font-size: 1rem;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}

export default Profile;
