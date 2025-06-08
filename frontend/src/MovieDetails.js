import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://movie-recommendation-app-backend-equ7.onrender.com';

function MovieDetails({ movieId, onBack }) {
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/movies/${movieId}`)
      .then(res => res.json())
      .then(setMovie);
  }, [movieId]);

  if (!movie) return <div className="text-center mt-5">Select a movie to see details.</div>;

  return (
    <div className="movie-details-container" aria-label="Movie Details">
      <div className="movie-details-flex">
        <div className="movie-details-poster">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              style={{ borderRadius: 18, width: '100%', maxWidth: 300 }}
            />
          ) : (
            <div style={{ height: 300, width: 200, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', borderRadius: 18 }}>No Image</div>
          )}
        </div>
        <div className="movie-details-info">
          <h2 className="fw-bold mb-2">{movie.title}</h2>
          <div className="mb-2 text-secondary">{movie.release_date}</div>
          <div className="mb-3">{movie.overview}</div>
          <button className="btn btn-secondary me-2" onClick={onBack} aria-label="Back to list" style={{ minHeight: 44, minWidth: 44 }}>Back</button>
          {/* Add more accessible actions here if needed */}
        </div>
      </div>
      <style>{`
        .movie-details-container {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }
        .movie-details-flex {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        @media (min-width: 900px) {
          .movie-details-flex {
            flex-direction: row;
          }
          .movie-details-poster {
            flex: 0 0 300px;
          }
          .movie-details-info {
            flex: 1;
          }
        }
        .btn-secondary {
          font-size: 1rem;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}

export default MovieDetails;
