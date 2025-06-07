import React, { useEffect, useState } from 'react';
import { authFetch } from './api';

function Watchlists() {
  const [watchlists, setWatchlists] = useState([]);
  const [newName, setNewName] = useState('');
  const [message, setMessage] = useState('');

  const fetchWatchlists = async () => {
    const res = await authFetch(
      `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/watchlists`
    );
    const data = await res.json();
    if (res.ok) setWatchlists(data);
    else setMessage(data.message || 'Failed to fetch watchlists');
  };

  const createWatchlist = async e => {
    e.preventDefault();
    const res = await authFetch(
      `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/watchlists`,
      {
        method: 'POST',
        body: JSON.stringify({ name: newName }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      setWatchlists([...watchlists, data]);
      setNewName('');
      setMessage('Watchlist created!');
    } else {
      setMessage(data.message || 'Failed to create watchlist');
    }
  };

  useEffect(() => {
    fetchWatchlists();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container my-4">
      <h3>Your Watchlists</h3>
      <form className="mb-3" onSubmit={createWatchlist}>
        <div className="input-group">
          <input
            className="form-control"
            placeholder="New watchlist name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            required
          />
          <button className="btn btn-primary" type="submit">Create</button>
        </div>
      </form>
      {message && <div className="alert alert-info">{message}</div>}
      <div>
        {watchlists.map(wl => (
          <div key={wl._id} className="mb-3">
            <h5>{wl.name}</h5>
            <ul>
              {wl.movies && wl.movies.length > 0 ? (
                wl.movies.map(m => (
                  <li key={m.movieId}>{m.title}</li>
                ))
              ) : (
                <li>No movies yet.</li>
              )}
            </ul>
          </div>
        ))}
        {watchlists.length === 0 && <div>No watchlists yet.</div>}
      </div>
    </div>
  );
}

export default Watchlists;