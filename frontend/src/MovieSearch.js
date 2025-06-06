import React, { useState } from 'react';

function MovieSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');

  const handleSearch = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const params = new URLSearchParams({ query, year, genre });
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/movies/search?${params}`
      );
      const data = await res.json();
      setResults(data.results || []);
      if (!data.results || data.results.length === 0) setMessage('No movies found.');
    } catch {
      setMessage('Error searching movies.');
    }
  };

  return (
    <div className="container my-4">
      <form className="row g-2" onSubmit={handleSearch}>
        <div className="col">
          <input className="form-control" placeholder="Title" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div className="col">
          <input className="form-control" placeholder="Year" value={year} onChange={e => setYear(e.target.value)} />
        </div>
        <div className="col">
          <input className="form-control" placeholder="Genre ID" value={genre} onChange={e => setGenre(e.target.value)} />
        </div>
        <div className="col-auto">
          <button className="btn btn-primary" type="submit">Search</button>
        </div>
      </form>
      {message && <div className="alert alert-info mt-2">{message}</div>}
      <div className="row mt-3">
        {results.map(movie => (
          <div className="col-md-4 mb-3" key={movie.id}>
            <div className="card h-100" onClick={() => onSelect(movie.id)} style={{ cursor: 'pointer' }}>
              {movie.poster_path && (
                <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} className="card-img-top" alt={movie.title} />
              )}
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">{movie.release_date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieSearch;