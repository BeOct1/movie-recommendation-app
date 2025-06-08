import React, { useEffect, useState } from 'react';
import { getFavorites, removeFavorite } from './api';

function FavoritesList({ compact }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFavorites = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  const handleRemoveFavorite = async (movieId) => {
    try {
      await removeFavorite(movieId);
      setFavorites(favorites.filter(fav => fav.movieId !== movieId));
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    fetchFavorites();
    // eslint-disable-next-line
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;
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
              <button className="btn btn-sm btn-outline-danger mt-auto" onClick={() => handleRemoveFavorite(fav.movieId)}>
                Remove
              </button>
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