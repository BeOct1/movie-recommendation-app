import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (!movie) return <div className="container mt-4">No details found.</div>;

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={onBack}>Back to List</button>
      <div className="card p-3">
        <div className="row">
          <div className="col-md-4">
            {movie.poster_path && <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} className="img-fluid rounded" />}
          </div>
          <div className="col-md-8">
            <h2>{movie.title} <small className="text-muted">({movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'})</small></h2>
            <p><b>Rating:</b> {movie.vote_average}</p>
            <p><b>Overview:</b> {movie.overview}</p>
            {movie.genres && <p><b>Genres:</b> {movie.genres.map(g => g.name).join(', ')}</p>}
            {movie.credits && movie.credits.cast && (
              <div><b>Cast:</b> {movie.credits.cast.slice(0, 5).map(c => c.name).join(', ')}</div>
            )}
            {movie.videos && movie.videos.results && movie.videos.results.length > 0 && (
              <div className="mt-3">
                <b>Trailer:</b>
                <div className="ratio ratio-16x9">
                  <iframe
                    src={`https://www.youtube.com/embed/${movie.videos.results[0].key}`}
                    title="Trailer"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
