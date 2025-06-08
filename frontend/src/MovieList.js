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
    <div className="container my-4">
      {loading && <div className="text-center my-4"><div className="spinner-border text-warning" role="status"><span className="visually-hidden">Loading...</span></div></div>}
      {error && <div className="alert alert-info mt-2">{error}</div>}
      <h2>Movie Discovery</h2>
      <form className="row g-2 align-items-end mb-3" onSubmit={handleSearch}>
        <div className="col-md-3">
          <input placeholder="Search by title" className="form-control" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="col-md-2">
          <input placeholder="Year" className="form-control" value={year} onChange={e => setYear(e.target.value)} />
        </div>
        <div className="col-md-2">
          <input placeholder="Min Rating" className="form-control" value={voteAverageGte} onChange={e => setVoteAverageGte(e.target.value)} />
        </div>
        <div className="col-md-2">
          <input placeholder="Max Rating" className="form-control" value={voteAverageLte} onChange={e => setVoteAverageLte(e.target.value)} />
        </div>
        <div className="col-md-2">
          <select className="form-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="popularity.desc">Most Popular</option>
            <option value="release_date.desc">Newest</option>
            <option value="vote_average.desc">Top Rated</option>
          </select>
        </div>
        <div className="col-md-1">
          <button type="submit" className="btn btn-primary w-100">Search</button>
        </div>
      </form>
      <div className="row">
        {movies.map(movie => (
          <div
            className="col-md-3 mb-4"
            key={movie.id}
            style={{ display: 'flex', alignItems: 'stretch' }}
          >
            <div
              className="card h-100 shadow-sm border-0 movie-card-hover"
              style={{
                borderRadius: 18,
                overflow: 'hidden',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
                background: '#fff',
                boxShadow: '0 2px 12px rgba(0,0,0,0.07)'
              }}
              onClick={() => setSelectedMovie(movie)}
            >
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                  className="card-img-top"
                  style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18, objectFit: 'cover', height: 340 }}
                />
              ) : (
                <div style={{ height: 340, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>No Image</div>
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold" style={{ fontSize: 20 }}>{movie.title}</h5>
                <p className="card-text text-secondary mb-1">Rating: {movie.vote_average}</p>
                <p className="card-text text-secondary mb-2">Release: {movie.release_date}</p>
                {/* ...other info... */}
              </div>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .movie-card-hover:hover {
          transform: scale(1.04);
          box-shadow: 0 8px 32px rgba(0,0,0,0.13);
        }
      `}</style>
    </div>
  );
}

export default MovieList;
