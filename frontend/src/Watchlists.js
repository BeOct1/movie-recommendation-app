import React, { useEffect, useState } from 'react';
import { getWatchlists, createWatchlist as apiCreateWatchlist } from './api';

function Watchlists({ compact }) {
  const [watchlists, setWatchlists] = useState([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchWatchlists = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getWatchlists();
      setWatchlists(data);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  const handleCreateWatchlist = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const data = await apiCreateWatchlist({ name: newName });
      setWatchlists([...watchlists, data]);
      setNewName('');
      setSuccess('Watchlist created!');
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    fetchWatchlists();
    // eslint-disable-next-line
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;
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
    <div>
      <form className="mb-3 d-flex gap-2" onSubmit={handleCreateWatchlist}>
        <input
          className="form-control"
          type="text"
          placeholder="New watchlist name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          required
        />
        <button className="btn btn-primary" type="submit">Create</button>
      </form>
      {success && <div className="text-success mb-2">{success}</div>}
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
    </div>
  );
}

export default Watchlists;