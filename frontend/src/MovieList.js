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
    <div className="container mt-4">
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
          <div className="col-md-4 mb-4" key={movie.id}>
            <div className="card h-100">
              {movie.poster_path && <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} className="card-img-top" />}
              <div className="card-body">
                <h5 className="card-title">{movie.title} <small className="text-muted">({movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'})</small></h5>
                {movie.vote_average && <div>Rating: {movie.vote_average}</div>}
                {movie.overview && <p className="card-text">{movie.overview}</p>}
                <button className="btn btn-outline-info mt-2" onClick={() => setSelectedMovie(movie.id)}>Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieList;
