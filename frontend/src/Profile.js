import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'https://movie-recommendation-app-backend-equ7.onrender.com';

function Profile() {
  const { user } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(user);
  const [message, setMessage] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

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
          setProfile(data);
        } else {
          setError(data.message || 'Failed to fetch profile');
        }
      } catch (err) {
        setError('Server error');
      }
    };
    fetchProfile();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;
    let updatedProfile = { ...profile };
    if (avatar) {
      // Simulate upload: in production, upload to S3/Cloudinary and save URL
      updatedProfile.avatarUrl = avatarPreview;
    }
    try {
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProfile)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Profile updated successfully');
        setProfile(data);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  if (error) return <div className="alert alert-danger mt-4 container" style={{maxWidth: 500}}>{error}</div>;
  if (!profile) return <div>Loading...</div>;

  return (
    <form onSubmit={handleUpdate} className="profile-form" aria-label="Update profile">
      <div className="form-group" style={{ alignItems: 'center' }}>
        <label htmlFor="profile-avatar" className="form-label">Avatar</label>
        <input
          id="profile-avatar"
          type="file"
          accept="image/*"
          className="form-control"
          onChange={handleAvatarChange}
          aria-label="Avatar"
        />
        <div style={{ marginTop: 8 }}>
          <img
            src={avatarPreview || profile.avatarUrl || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(profile.username)}
            alt="Avatar Preview"
            style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffc107' }}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="profile-username" className="form-label">Username</label>
        <input
          id="profile-username"
          className="form-control"
          value={profile.username}
          onChange={e => setProfile({ ...profile, username: e.target.value })}
          required
          aria-label="Username"
        />
      </div>
      <div className="form-group">
        <label htmlFor="profile-email" className="form-label">Email</label>
        <input
          id="profile-email"
          className="form-control"
          value={profile.email}
          onChange={e => setProfile({ ...profile, email: e.target.value })}
          required
          aria-label="Email"
        />
      </div>
      <button className="btn btn-primary mt-3" type="submit" style={{ minHeight: 44, minWidth: 44 }}>Update Profile</button>
      {message && <div className="mt-2 text-success" role="status">{message}</div>}
      <style>{`
        .profile-form {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          max-width: 400px;
          margin: 0 auto;
        }
        @media (min-width: 600px) {
          .profile-form {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .btn-primary {
          font-size: 1rem;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
        }
      `}</style>
    </form>
  );
}

export default Profile;
