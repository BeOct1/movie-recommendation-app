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
      <ul className="list-group list-group-flush" aria-label="Favorite Movies">
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
    <div className="favorites-grid" role="list" aria-label="Favorite Movies">
      {favorites.map(fav => (
        <div
          className="favorite-card"
          key={fav._id || fav.movieId}
          role="listitem"
          tabIndex={0}
          aria-label={`Favorite movie: ${fav.title}`}
        >
          {fav.posterPath ? (
            <img
              src={`https://image.tmdb.org/t/p/w200${fav.posterPath}`}
              alt={fav.title}
              className="card-img-top"
              style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18, objectFit: 'cover', height: 220 }}
            />
          ) : (
            <div style={{ height: 220, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>No Image</div>
          )}
          <div className="card-body d-flex flex-column">
            <h6 className="card-title fw-bold text-truncate">{fav.title}</h6>
            <button
              className="btn btn-sm btn-outline-danger mt-auto"
              onClick={() => handleRemoveFavorite(fav.movieId)}
              aria-label={`Remove ${fav.title} from favorites`}
              style={{ minHeight: 44, minWidth: 44 }}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <style>{`
        .favorites-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 600px) {
          .favorites-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 900px) {
          .favorites-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .favorite-card {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          outline: none;
          transition: transform 0.3s, box-shadow 0.3s;
          cursor: pointer;
        }
        .favorite-card:focus {
          box-shadow: 0 0 0 3px #f59e42;
        }
        .favorite-card:hover {
          transform: scale(1.04);
          box-shadow: 0 8px 32px rgba(0,0,0,0.13);
        }
        .card-body {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 1rem;
        }
        .btn-outline-danger {
          font-size: 1rem;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}

export default FavoritesList;