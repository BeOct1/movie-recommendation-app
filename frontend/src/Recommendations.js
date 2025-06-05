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

  if (error) return <div>{error}</div>;
  if (!movies.length) return <div>No recommendations yet.</div>;

  return (
    <div>
      <h2>Recommended Movies</h2>
      <ul>
        {movies.map(movie => (
          <li key={movie._id}>
            <b>{movie.title}</b> ({movie.year}) - {movie.genre}
            {movie.description && <div>{movie.description}</div>}
            {movie.posterUrl && <img src={movie.posterUrl} alt={movie.title} style={{width: '100px'}} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Recommendations;
