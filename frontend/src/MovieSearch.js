import React, { useState, useEffect, useRef } from 'react';
import { searchMovies } from './api';

function MovieSearch({ setSelectedMovie }) {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef();

  useEffect(() => {
    if (query.trim() === '' && year === '' && genre === '') {
      setResults([]);
      setMessage('');
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleSearch();
    }, 400);
    // eslint-disable-next-line
  }, [query, year, genre]);

  const handleSearch = async () => {
    setMessage('');
    setLoading(true);
    try {
      const data = await searchMovies({ query, year, genre });
      setResults(data.results || []);
      if (!data.results || data.results.length === 0) setMessage('No movies found.');
    } catch (err) {
      setMessage(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <form className="row g-2 align-items-end mb-3" onSubmit={e => { e.preventDefault(); handleSearch(); }}>
        <div className="col-md-4">
          <div className="form-floating">
            <input
              className="form-control rounded-3"
              id="searchTitle"
              placeholder="Title"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <label htmlFor="searchTitle">Title</label>
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-floating">
            <input
              className="form-control rounded-3"
              id="searchYear"
              placeholder="Year"
              value={year}
              onChange={e => setYear(e.target.value)}
              type="number"
              min="1900"
              max={new Date().getFullYear()}
            />
            <label htmlFor="searchYear">Year</label>
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-floating">
            <input
              className="form-control rounded-3"
              id="searchGenre"
              placeholder="Genre ID"
              value={genre}
              onChange={e => setGenre(e.target.value)}
            />
            <label htmlFor="searchGenre">Genre ID</label>
          </div>
        </div>
        <div className="col-md-2">
          <button className="btn btn-warning w-100 py-2 fw-bold" type="submit" style={{ borderRadius: 24, fontSize: 18 }}>Search</button>
        </div>
      </form>
      {loading && <div className="text-center my-4"><div className="spinner-border text-warning" role="status"><span className="visually-hidden">Loading...</span></div></div>}
      {message && <div className="alert alert-info mt-2">{message}</div>}
      <div className="row mt-3">
        {results.map(movie => (
          <div className="col-md-4 mb-3" key={movie.id}>
            <div className="card h-100 shadow-sm border-0 movie-card-hover"
              style={{ borderRadius: 18, overflow: 'hidden', transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer', background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}
              onClick={() => setSelectedMovie(movie)}
            >
              {movie.poster_path ? (
                <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} style={{ width: '100%', borderRadius: 8 }} />
              ) : (
                <div style={{ height: 300, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>No Image</div>
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold" style={{ fontSize: 20 }}>{movie.title}</h5>
                <p className="card-text text-secondary mb-1">Rating: {movie.vote_average}</p>
                <p className="card-text text-secondary mb-2">Release: {movie.release_date}</p>
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

export default MovieSearch;