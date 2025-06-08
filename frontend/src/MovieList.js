import React, { useEffect, useState } from 'react';
import MovieDetails from './MovieDetails';
import { searchMovies } from './api';

const API_URL = process.env.REACT_APP_API_URL || 'https://movie-recommendation-app-backend-equ7.onrender.com';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [voteAverageGte, setVoteAverageGte] = useState('');
  const [voteAverageLte, setVoteAverageLte] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMovies = async () => {
    setLoading(true);
    setError('');
    searchMovies({ query: search, year, sort_by: sortBy, vote_average_gte: voteAverageGte, vote_average_lte: voteAverageLte })
      .then(data => {
        setMovies(data.results || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    fetchMovies();
  };

  if (selectedMovie) {
    return <MovieDetails movieId={selectedMovie} onBack={() => setSelectedMovie(null)} />;
  }

  return (
    <div className="movie-list-grid" role="list" aria-label="Movie List">
      {movies.map(movie => (
        <div
          className="movie-card"
          key={movie.id}
          role="listitem"
          tabIndex={0}
          aria-label={`Movie: ${movie.title}`}
        >
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
              className="card-img-top"
              style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18, objectFit: 'cover', height: 220 }}
            />
          ) : (
            <div style={{ height: 220, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>No Image</div>
          )}
          <div className="card-body d-flex flex-column">
            <h6 className="card-title fw-bold text-truncate">{movie.title}</h6>
            <button
              className="btn btn-sm btn-outline-primary mt-auto"
              onClick={() => onSelect(movie)}
              aria-label={`View details for ${movie.title}`}
              style={{ minHeight: 44, minWidth: 44 }}
            >
              Details
            </button>
          </div>
        </div>
      ))}
      <style>{`
        .movie-list-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 600px) {
          .movie-list-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 900px) {
          .movie-list-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .movie-card {
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
        .movie-card:focus {
          box-shadow: 0 0 0 3px #2563eb;
        }
        .movie-card:hover {
          transform: scale(1.04);
          box-shadow: 0 8px 32px rgba(0,0,0,0.13);
        }
        .card-body {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 1rem;
        }
        .btn-outline-primary {
          font-size: 1rem;
          padding: 0.75rem 1.25rem;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}

export default MovieList;
