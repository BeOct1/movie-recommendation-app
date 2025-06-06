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
      <div className="row">
        {movies.map(movie => (
          <div className="col-md-4 mb-4" key={movie._id || movie.id}>
            <div className="card h-100">
              {movie.posterUrl && <img src={movie.posterUrl} alt={movie.title} className="card-img-top" style={{width: '100px'}} />}
              <div className="card-body">
                <h5 className="card-title">{movie.title} <small className="text-muted">({movie.year || movie.release_date ? (movie.year || movie.release_date.substring(0, 4)) : 'N/A'})</small></h5>
                {movie.genre && <div>{movie.genre}</div>}
                {movie.description && <p className="card-text">{movie.description}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recommendations;
