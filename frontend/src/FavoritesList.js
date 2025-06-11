import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNotification } from './NotificationContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function FavoritesList() {
  const { token } = useContext(AuthContext);
  const notify = useNotification();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch favorites');
      const data = await res.json();
      setFavorites(data);
    } catch (err) {
      notify(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (movieId) => {
    try {
      const res = await fetch(`${API_URL}/api/favorites/${movieId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to remove favorite');
      setFavorites(favorites.filter(fav => fav.movieId !== movieId));
      notify('Favorite removed', 'success');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  useEffect(() => {
    if (token) fetchFavorites();
  }, [token]);

  if (loading) return <div>Loading favorites...</div>;
  if (!favorites.length) return <div>No favorites yet.</div>;

  return (
    <div>
      <h2>Your Favorites</h2>
      <ul className="list-group">
        {favorites.map(fav => (
          <li key={fav.movieId} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{fav.title}</span>
            <button className="btn btn-danger btn-sm" onClick={() => removeFavorite(fav.movieId)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FavoritesList;
