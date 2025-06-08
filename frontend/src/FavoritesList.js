import React, { useEffect, useState } from 'react';
import authFetch from './api';

function FavoritesList({ compact }) {
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    const res = await authFetch(
      `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/favorites`
    );
    const data = await res.json();
    if (res.ok) setFavorites(data);
    else setMessage(data.message || 'Failed to fetch favorites');
    setLoading(false);
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

  if (loading) return <div>Loading...</div>;
  if (!favorites.length) return <div className="text-secondary">No favorites yet.</div>;

  if (compact) {
    return (
      <ul className="list-group list-group-flush">
        {favorites.slice(0, 3).map(fav => (
          <li key={fav._id || fav.movieId} className="list-group-item bg-transparent px-0 py-1 border-0 text-truncate">
            {fav.title}
          </li>
        ))}
        {favorites.length > 3 && <li className="list-group-item bg-transparent px-0 py-1 border-0 text-primary">...and {favorites.length - 3} more</li>}
      </ul>
    );
  }

  return (
    <div className="row">
      {favorites.map(fav => (
        <div className="col-md-3 mb-3" key={fav._id || fav.movieId}>
          <div className="card h-100 shadow-sm border-0 movie-card-hover" style={{ borderRadius: 18, overflow: 'hidden', transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer', background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            {fav.posterPath ? (
              <img src={`https://image.tmdb.org/t/p/w200${fav.posterPath}`} alt={fav.title} className="card-img-top" style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18, objectFit: 'cover', height: 220 }} />
            ) : (
              <div style={{ height: 220, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>No Image</div>
            )}
            <div className="card-body d-flex flex-column">
              <h6 className="card-title fw-bold text-truncate">{fav.title}</h6>
            </div>
          </div>
        </div>
      ))}
      <style>{`
        .movie-card-hover:hover {
          transform: scale(1.04);
          box-shadow: 0 8px 32px rgba(0,0,0,0.13);
        }
      `}</style>
    </div>
  );
}

export default FavoritesList;