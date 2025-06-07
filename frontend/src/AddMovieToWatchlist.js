import React, { useEffect, useState } from 'react';
import { authFetch } from './api';
import 'bootstrap-icons/font/bootstrap-icons.css';

function AddMovieToWatchlist({ movie }) {
  const [watchlists, setWatchlists] = useState([]);
  const [selected, setSelected] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    authFetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/watchlists`)
      .then(res => res.json())
      .then(data => setWatchlists(data || []));
  }, []);

  const handleAdd = async e => {
    e.preventDefault();
    if (!selected) return setMessage('Select a watchlist');
    const res = await authFetch(
      `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/watchlists/${selected}/movies`,
      {
        method: 'POST',
        body: JSON.stringify({
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
        }),
      }
    );
    const data = await res.json();
    setMessage(res.ok ? 'Added to watchlist!' : data.message);
  };

  return (
    <div className="card shadow-sm h-100">
      <img src={movie.poster_path} className="card-img-top" alt={movie.title} />
      <div className="card-body">
        <h5 className="card-title">{movie.title}</h5>
        <p className="card-text">{movie.release_date}</p>
        <form className="d-flex align-items-center gap-2" onSubmit={handleAdd}>
          <select
            className="form-select"
            value={selected}
            onChange={e => setSelected(e.target.value)}
            required
          >
            <option value="">Select watchlist</option>
            {watchlists.map(wl => (
              <option key={wl._id} value={wl._id}>{wl.name}</option>
            ))}
          </select>
          <button className="btn btn-outline-success" type="submit">
            <i className="bi bi-plus-circle"></i> Add
          </button>
          {message && <span className="ms-2 text-success">{message}</span>}
        </form>
        <button className="btn btn-warning mt-2">
          <i className="bi bi-star-fill"></i> Favorite
        </button>
      </div>
    </div>
  );
}

export default AddMovieToWatchlist;