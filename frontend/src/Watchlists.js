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
      <ul className="list-group list-group-flush" aria-label="Watchlists">
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
      <form className="mb-3 d-flex gap-2 flex-wrap" onSubmit={handleCreateWatchlist} aria-label="Create new watchlist">
        <label htmlFor="new-watchlist-name" className="visually-hidden">New watchlist name</label>
        <input
          id="new-watchlist-name"
          className="form-control"
          type="text"
          placeholder="New watchlist name"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          required
          style={{ minWidth: 180, flex: 1 }}
        />
        <button className="btn btn-primary" type="submit" style={{ minHeight: 44, minWidth: 44 }}>Create</button>
      </form>
      {success && <div className="text-success mb-2" role="status">{success}</div>}
      <div className="watchlists-grid" role="list" aria-label="Watchlists">
        {watchlists.map(wl => (
          <div className="watchlist-card" key={wl._id || wl.name} role="listitem" tabIndex={0} aria-label={`Watchlist: ${wl.name}`}> 
            <div className="card-body d-flex flex-column">
              <h6 className="card-title fw-bold text-truncate">{wl.name}</h6>
              <div className="text-secondary small">{wl.movies.length} movies</div>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .watchlists-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 600px) {
          .watchlists-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 900px) {
          .watchlists-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .watchlist-card {
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
        .watchlist-card:focus {
          box-shadow: 0 0 0 3px #2563eb;
        }
        .watchlist-card:hover {
          transform: scale(1.04);
          box-shadow: 0 8px 32px rgba(0,0,0,0.13);
        }
        .card-body {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 1rem;
        }
        .btn-primary {
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

export default Watchlists;