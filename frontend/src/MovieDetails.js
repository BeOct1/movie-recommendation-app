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

  if (!movie) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container my-4">
      <button className="btn btn-secondary mb-3" onClick={onBack}>Back to Search</button>
      <div className="row">
        <div className="col-md-4">
          {movie.poster_path && (
            <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} className="img-fluid" />
          )}
        </div>
        <div className="col-md-8">
          <h2>{movie.title}</h2>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Overview:</strong> {movie.overview}</p>
          <p><strong>Genres:</strong> {movie.genres?.map(g => g.name).join(', ')}</p>
          <p><strong>Rating:</strong> {movie.vote_average}</p>
          <p><strong>Cast:</strong> {movie.credits?.cast?.slice(0, 5).map(c => c.name).join(', ')}</p>
          {movie.videos?.results?.length > 0 && (
            <div>
              <strong>Trailer:</strong>
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
  );
}

export default MovieDetails;
