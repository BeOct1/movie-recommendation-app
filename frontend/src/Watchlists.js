import React, { useEffect, useState } from 'react';
import authFetch from './api';

function Watchlists({ compact }) {
  const [watchlists, setWatchlists] = useState([]);
  const [newName, setNewName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchWatchlists = async () => {
    const res = await authFetch(
      `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/watchlists`
    );
    const data = await res.json();
    if (res.ok) setWatchlists(data);
    else setMessage(data.message || 'Failed to fetch watchlists');
    setLoading(false);
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

  if (loading) return <div>Loading...</div>;
  if (!watchlists.length) return <div className="text-secondary">No watchlists yet.</div>;

  if (compact) {
    return (
      <ul className="list-group list-group-flush">
        {watchlists.slice(0, 2).map(wl => (
          <li key={wl._id || wl.name} className="list-group-item bg-transparent px-0 py-1 border-0 text-truncate">
            {wl.name} ({wl.movies.length} movies)
          </li>
        ))}
        {watchlists.length > 2 && <li className="list-group-item bg-transparent px-0 py-1 border-0 text-primary">...and {watchlists.length - 2} more</li>}
      </ul>
    );
  }

  return (
    <div className="row">
      {watchlists.map(wl => (
        <div className="col-md-4 mb-3" key={wl._id || wl.name}>
          <div className="card h-100 shadow-sm border-0" style={{ borderRadius: 18, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
            <div className="card-body d-flex flex-column">
              <h6 className="card-title fw-bold text-truncate">{wl.name}</h6>
              <div className="text-secondary small">{wl.movies.length} movies</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Watchlists;