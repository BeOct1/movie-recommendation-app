import React, { useEffect, useState } from 'react';
import { authFetch } from './api';

function FavoritesList() {
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState('');

  const fetchFavorites = async () => {
    const res = await authFetch(
      `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/favorites`
    );
    const data = await res.json();
    if (res.ok) setFavorites(data);
    else setMessage(data.message || 'Failed to fetch favorites');
  };

  const removeFavorite = async (movieId) => {
    const res = await authFetch(
      `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/favorites/${movieId}`,
      { method: 'DELETE' }
    );
    const data = await res.json();
    if (res.ok) {
      setFavorites(favorites.filter(fav => fav.movieId !== movieId));
      setMessage('Favorite removed');
    } else {
      setMessage(data.message || 'Failed to remove favorite');
    }
  };

  useEffect(() => {
    fetchFavorites();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container my-4">
      <h3>Your Favorites</h3>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="row">
        {favorites.map(fav => (
          <div className="col-md-3 mb-3" key={fav.movieId}>
            <div className="card h-100">
              {fav.posterPath && (
                <img src={`https://image.tmdb.org/t/p/w200${fav.posterPath}`} className="card-img-top" alt={fav.title} />
              )}
              <div className="card-body">
                <h5 className="card-title">{fav.title}</h5>
                <button className="btn btn-danger btn-sm" onClick={() => removeFavorite(fav.movieId)}>
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
        {favorites.length === 0 && <div>No favorites yet.</div>}
      </div>
    </div>
  );
}

export default FavoritesList;