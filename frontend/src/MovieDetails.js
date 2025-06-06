import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'https://movie-recommendation-app-backend-equ7.onrender.com';

function MovieDetails({ movieId, onBack }) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/movies/details/${movieId}`);
      const data = await res.json();
      setMovie(data);
      setLoading(false);
    };
    fetchDetails();
  }, [movieId]);

  if (loading) return <div>Loading...</div>;
  if (!movie) return <div>No details found.</div>;

  return (
    <div>
      <button onClick={onBack}>Back to List</button>
      <h2>{movie.title} ({movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'})</h2>
      <p><b>Rating:</b> {movie.vote_average}</p>
      <p><b>Overview:</b> {movie.overview}</p>
      {movie.poster_path && <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} />}
      {movie.genres && <p><b>Genres:</b> {movie.genres.map(g => g.name).join(', ')}</p>}
      {movie.credits && movie.credits.cast && (
        <div><b>Cast:</b> {movie.credits.cast.slice(0, 5).map(c => c.name).join(', ')}</div>
      )}
      {movie.videos && movie.videos.results && movie.videos.results.length > 0 && (
        <div>
          <b>Trailer:</b>
          <div>
            <iframe
              width="420"
              height="315"
              src={`https://www.youtube.com/embed/${movie.videos.results[0].key}`}
              title="Trailer"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;
