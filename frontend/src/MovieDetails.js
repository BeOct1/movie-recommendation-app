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
      <div className="row g-4 align-items-start">
        <div className="col-md-4">
          {movie.poster_path ? (
            <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} className="img-fluid rounded-4 shadow" />
          ) : (
            <div style={{ height: 420, background: '#eee', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>No Image</div>
          )}
        </div>
        <div className="col-md-8">
          <h1 className="fw-bold mb-2" style={{ fontSize: 40 }}>{movie.title}</h1>
          <div className="mb-3">
            <span className="badge bg-warning text-dark me-2" style={{ fontSize: 18 }}>{movie.vote_average} / 10</span>
            <span className="text-secondary">{movie.release_date}</span>
          </div>
          <p className="mb-3" style={{ fontSize: 18 }}>{movie.overview}</p>
          <div className="mb-3">
            <strong>Genres:</strong> {movie.genres?.map(g => g.name).join(', ') || 'N/A'}
          </div>
          {movie.homepage && (
            <a href={movie.homepage} target="_blank" rel="noopener noreferrer" className="btn btn-outline-secondary mb-3">Official Website</a>
          )}
          {/* Rating widget placeholder */}
          <div className="mb-4">
            <strong>Your Rating:</strong> <span className="text-muted">(Coming soon)</span>
          </div>
        </div>
      </div>
      {/* User reviews section placeholder */}
      <div className="mt-5">
        <h3 className="fw-bold mb-3">User Reviews</h3>
        <div className="card p-4 rounded-4 shadow-sm mb-3" style={{ background: '#f8fafc' }}>
          <div className="text-muted">User reviews and review form coming soon.</div>
        </div>
      </div>
      <style>{`
        .movie-details-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 900px;
          margin: 0 auto;
          padding: 1.5rem;
        }
        @media (min-width: 700px) {
          .movie-details-container {
            flex-direction: row;
            align-items: flex-start;
          }
        }
        .btn {
          min-height: 44px;
          min-width: 44px;
          font-size: 1rem;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}

export default MovieDetails;
