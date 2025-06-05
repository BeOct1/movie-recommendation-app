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
    <div>
      <h2>Add Movie</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} required />
        <input name="year" placeholder="Year" value={form.year} onChange={handleChange} />
        <input name="posterUrl" placeholder="Poster URL" value={form.posterUrl} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <button type="submit">Add Movie</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddMovie;
