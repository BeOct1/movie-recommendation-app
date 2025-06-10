import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { addFavorite, removeFavorite, addMovieToWatchlist, getUserReviews, addReview } from './api';
import { AuthContext } from './AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'https://movie-recommendation-app-backend-equ7.onrender.com';

function MovieDetails({ movieId, onBack }) {
  const { isAuthenticated } = React.useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(8);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/movies/${movieId}`)
      .then(res => res.json())
      .then(setMovie);
    // Fetch user reviews for this movie
    getUserReviews(movieId).then(setReviews).catch(() => {});
    // TODO: fetch favorite/watchlist status for this user/movie
  }, [movieId]);

  const handleFavorite = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      if (isFavorite) {
        await removeFavorite(movieId);
        setIsFavorite(false);
      } else {
        await addFavorite({ movieId, title: movie.title, posterPath: movie.poster_path });
        setIsFavorite(true);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleAddToWatchlist = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      await addMovieToWatchlist('default', { movieId, title: movie.title, posterPath: movie.poster_path });
      setInWatchlist(true);
    } finally {
      setLoading(false);
    }
  };
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      await addReview({ movieId, rating: reviewRating, comment: reviewText });
      setReviewText('');
      setReviewRating(8);
      setReviews(await getUserReviews(movieId));
    } finally {
      setLoading(false);
    }
  };

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
          <div className="mb-4 d-flex gap-3">
            <button className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline-danger'}`} onClick={handleFavorite} disabled={loading} aria-pressed={isFavorite} aria-label="Add to favorites">{isFavorite ? 'Remove Favorite' : 'Add to Favorites'}</button>
            <button className={`btn ${inWatchlist ? 'btn-success' : 'btn-outline-success'}`} onClick={handleAddToWatchlist} disabled={loading} aria-pressed={inWatchlist} aria-label="Add to watchlist">{inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</button>
          </div>
        </div>
      </div>
      {/* User reviews section placeholder */}
      <div className="mt-5">
        <h3 className="fw-bold mb-3">User Reviews</h3>
        <form onSubmit={handleReviewSubmit} className="mb-4 d-flex flex-column flex-md-row gap-3 align-items-md-end">
          <div>
            <label htmlFor="review-rating" className="form-label">Rating</label>
            <input id="review-rating" type="number" min="1" max="10" value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))} className="form-control" style={{ width: 80 }} required />
          </div>
          <div className="flex-grow-1">
            <label htmlFor="review-text" className="form-label">Comment</label>
            <input id="review-text" value={reviewText} onChange={e => setReviewText(e.target.value)} className="form-control" placeholder="Write your review..." required />
          </div>
          <button className="btn btn-warning" type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post Review'}</button>
        </form>
        <div>
          {reviews.length === 0 ? <div className="text-muted">No reviews yet.</div> : reviews.map(r => (
            <div key={r._id} className="card p-3 mb-2">
              <div className="fw-bold">{r.user?.username || 'User'}</div>
              <div>Rating: {r.rating} / 10</div>
              <div>{r.comment}</div>
            </div>
          ))}
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
