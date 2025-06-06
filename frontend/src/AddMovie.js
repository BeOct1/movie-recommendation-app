import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'https://movie-recommendation-app-backend-equ7.onrender.com';

function AddMovie({ onMovieAdded }) {
  const [form, setForm] = useState({ title: '', genre: '', year: '', description: '', posterUrl: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('You must be logged in to add a movie.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...form,
          year: form.year ? parseInt(form.year, 10) : undefined
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Movie added!');
        setForm({ title: '', genre: '', year: '', description: '', posterUrl: '' });
        if (onMovieAdded) onMovieAdded();
      } else {
        setMessage(data.message || 'Failed to add movie');
      }
    } catch (err) {
      setMessage('Server error');
    }
  };

  return (
    <div className="container mt-4" style={{maxWidth: 500}}>
      <h2 className="mb-3">Add Movie</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input name="title" className="form-control" placeholder="Title" value={form.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <input name="genre" className="form-control" placeholder="Genre" value={form.genre} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <input name="year" className="form-control" placeholder="Year" value={form.year} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <input name="posterUrl" className="form-control" placeholder="Poster URL" value={form.posterUrl} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <textarea name="description" className="form-control" placeholder="Description" value={form.description} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-success w-100">Add Movie</button>
      </form>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}

export default AddMovie;
