import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'https://movie-recommendation-app-backend-equ7.onrender.com';

function Recommendations() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      const token = localStorage.getItem('token');
      if (!token) return setError('Login to see recommendations');
      try {
        const res = await fetch(`${API_URL}/api/movies/recommendations`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setMovies(data);
        else setError(data.message || 'Failed to fetch recommendations');
      } catch (err) {
        setError('Server error');
      }
    };
    fetchRecommendations();
  }, []);

  if (error) return <div className="alert alert-danger mt-4 container" style={{maxWidth: 500}}>{error}</div>;
  if (!movies.length) return <div className="container mt-4">No recommendations yet.</div>;

  return (
    <div className="container mt-4">
      <h2>Recommended Movies</h2>
      <div className="recommendations-grid" role="list" aria-label="Recommended Movies">
        {movies.map(movie => (
          <div
            className="recommendation-card"
            key={movie._id || movie.id}
            role="listitem"
            tabIndex={0}
            aria-label={`Recommended movie: ${movie.title}`}
          >
            {movie.posterUrl && <img src={movie.posterUrl} alt={movie.title} className="card-img-top" style={{width: '100px'}} />}
            <div className="card-body">
              <h5 className="card-title">{movie.title} <small className="text-muted">({movie.year || movie.release_date ? (movie.year || movie.release_date.substring(0, 4)) : 'N/A'})</small></h5>
              {movie.genre && <div>{movie.genre}</div>}
              {movie.description && <p className="card-text">{movie.description}</p>}
            </div>
          </div>
        ))}
        <style>{`
          .recommendations-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          @media (min-width: 600px) {
            .recommendations-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          @media (min-width: 900px) {
            .recommendations-grid {
              grid-template-columns: repeat(4, 1fr);
            }
          }
          .recommendation-card {
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
          .recommendation-card:focus {
            box-shadow: 0 0 0 3px #f59e42;
          }
          .recommendation-card:hover {
            transform: scale(1.04);
            box-shadow: 0 8px 32px rgba(0,0,0,0.13);
          }
        `}</style>
      </div>
    </div>
  );
}

export default Recommendations;
