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
    <div className="movie-search-container">
      <form className="mb-4 d-flex flex-wrap gap-2 align-items-end" onSubmit={handleSearch} aria-label="Movie search form">
        <label htmlFor="search-query" className="visually-hidden">Search</label>
        <input
          id="search-query"
          className="form-control"
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Search movies"
          style={{ minWidth: 180, flex: 1 }}
        />
        <button className="btn btn-primary" type="submit" style={{ minHeight: 44, minWidth: 44 }}>Search</button>
      </form>
      {loading && <div>Loading...</div>}
      {message && <div className="alert alert-info mt-2">{message}</div>}
      <div className="movie-search-grid" role="list" aria-label="Search Results">
        {results.map(movie => (
          <div
            className="movie-search-card"
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
                onClick={() => setSelectedMovie(movie)}
                aria-label={`View details for ${movie.title}`}
                style={{ minHeight: 44, minWidth: 44 }}
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .movie-search-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 600px) {
          .movie-search-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 900px) {
          .movie-search-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        .movie-search-card {
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
        .movie-search-card:focus {
          box-shadow: 0 0 0 3px #2563eb;
        }
        .movie-search-card:hover {
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
        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0,0,0,0);
          border: 0;
        }
      `}</style>
    </div>
  );
}

export default MovieSearch;