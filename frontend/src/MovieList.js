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
    <div>
      <h2>Movie Discovery</h2>
      <form onSubmit={handleSearch}>
        <input placeholder="Search by title" value={search} onChange={e => setSearch(e.target.value)} />
        <input placeholder="Year" value={year} onChange={e => setYear(e.target.value)} />
        <input placeholder="Min Rating" value={voteAverageGte} onChange={e => setVoteAverageGte(e.target.value)} />
        <input placeholder="Max Rating" value={voteAverageLte} onChange={e => setVoteAverageLte(e.target.value)} />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="popularity.desc">Most Popular</option>
          <option value="release_date.desc">Newest</option>
          <option value="vote_average.desc">Top Rated</option>
        </select>
        <button type="submit">Search</button>
      </form>
      <ul>
        {movies.map(movie => (
          <li key={movie.id}>
            <b>{movie.title}</b> ({movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'})
            {movie.vote_average && <> - Rating: {movie.vote_average}</>}
            {movie.overview && <div>{movie.overview}</div>}
            {movie.poster_path && <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} style={{width: '100px'}} />}
            <button onClick={() => setSelectedMovie(movie.id)}>Details</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MovieList;
