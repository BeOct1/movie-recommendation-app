import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'https://movie-recommendation-app-backend-equ7.onrender.com';

function MovieList() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');

  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMovies = async () => {
    let url = `${API_URL}/api/movies`;
    const params = [];
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (genre) params.push(`genre=${encodeURIComponent(genre)}`);
    if (params.length) url += '?' + params.join('&');
    const res = await fetch(url);
    const data = await res.json();
    setMovies(data);
  };

  const handleSearch = e => {
    e.preventDefault();
    fetchMovies();
  };

  return (
    <div>
      <h2>Movie List</h2>
      <form onSubmit={handleSearch}>
        <input placeholder="Search by title" value={search} onChange={e => setSearch(e.target.value)} />
        <input placeholder="Genre" value={genre} onChange={e => setGenre(e.target.value)} />
        <button type="submit">Search</button>
      </form>
      <ul>
        {movies.map(movie => (
          <li key={movie._id}>
            <b>{movie.title}</b> ({movie.year}) - {movie.genre}
            {movie.description && <div>{movie.description}</div>}
            {movie.posterUrl && <img src={movie.posterUrl} alt={movie.title} style={{width: '100px'}} />}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MovieList;
