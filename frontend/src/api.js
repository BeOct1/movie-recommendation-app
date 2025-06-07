import { useEffect, useState } from 'react';
import authFetch from './api';

// Example usage in MovieDetails.js
function FavoriteButton({ movie }) {
  const [message, setMessage] = useState('');

  const addFavorite = async () => {
    const res = await authFetch(
      `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/favorites`,
      {
        method: 'POST',
        body: JSON.stringify({
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
        }),
      }
    );
    const data = await res.json();
    setMessage(res.ok ? 'Added to favorites!' : data.message);
  };

  return (
    <div>
      <button className="btn btn-warning" onClick={addFavorite}>Add to Favorites</button>
      {message && <div className="mt-2">{message}</div>}
    </div>
  );
}

function ReviewForm({ movieId, onReview }) {
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');

  const submitReview = async e => {
    e.preventDefault();
    const res = await authFetch(
      `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/reviews`,
      {
        method: 'POST',
        body: JSON.stringify({ movieId, rating, comment }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      setMessage('Review submitted!');
      setRating('');
      setComment('');
      if (onReview) onReview();
    } else {
      setMessage(data.message);
    }
  };

  return (
    <form onSubmit={submitReview}>
      <div className="mb-2">
        <label>Rating (1-10)</label>
        <input className="form-control" type="number" min="1" max="10" value={rating} onChange={e => setRating(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label>Comment</label>
        <textarea className="form-control" value={comment} onChange={e => setComment(e.target.value)} />
      </div>
      <button className="btn btn-success" type="submit">Submit Review</button>
      {message && <div className="mt-2">{message}</div>}
    </form>
  );
}

function Profile() {
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    authFetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/profile`)
      .then(res => res.json())
      .then(setProfile);
  }, []);

  const handleUpdate = async e => {
    e.preventDefault();
    const res = await authFetch(
      `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/profile`,
      {
        method: 'PUT',
        body: JSON.stringify(profile),
      }
    );
    const data = await res.json();
    setMessage(res.ok ? 'Profile updated!' : data.message);
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <form onSubmit={handleUpdate}>
      <div className="mb-2">
        <label>Username</label>
        <input className="form-control" value={profile.username} onChange={e => setProfile({ ...profile, username: e.target.value })} />
      </div>
      <div className="mb-2">
        <label>Email</label>
        <input className="form-control" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
      </div>
      <button className="btn btn-primary" type="submit">Update Profile</button>
      {message && <div className="mt-2">{message}</div>}
    </form>
  );
}

export default Profile;