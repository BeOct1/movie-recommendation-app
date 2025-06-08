import React, { useEffect, useState } from 'react';
import MovieDetails from './MovieDetails';

const API_URL = process.env.REACT_APP_API_URL || 'https://movie-recommendation-app-backend-equ7.onrender.com';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [voteAverageGte, setVoteAverageGte] = useState('');
  const [voteAverageLte, setVoteAverageLte] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(null);

  const fetchMovies = async () => {
    let url = `${API_URL}/api/movies/search?query=${encodeURIComponent(search)}`;
    if (year) url += `&year=${encodeURIComponent(year)}`;
    if (sortBy) url += `&sort_by=${encodeURIComponent(sortBy)}`;
    if (voteAverageGte) url += `&vote_average_gte=${encodeURIComponent(voteAverageGte)}`;
    if (voteAverageLte) url += `&vote_average_lte=${encodeURIComponent(voteAverageLte)}`;
    const res = await fetch(url);
    const data = await res.json();
    setMovies(data.results || []);
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
