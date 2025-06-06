import React, { useState } from 'react';

function MovieSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');

  const handleSearch = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const params = new URLSearchParams({ query, year });
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/movies/search?${params}`
      );
      const data = await res.json();
      setResults(data.results || []);
      if (!data.results || data.results.length === 0) setMessage('No movies found.');
    } catch {
      setMessage('Search error');
    }
  };

  return (
    <div className="container mt-4">
      <form className="row g-2" onSubmit={handleSearch}>
        <div className="col">
          <input className="form-control" placeholder="Title" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div className="col">
          <input className="form-control" placeholder="Year" value={year} onChange={e => setYear(e.target.value)} />
        </div>
        <div className="col-auto">
          <button className="btn btn-primary" type="submit">Search</button>
        </// filepath: c:\Users\Bitrus.ed\Desktop\movie-recommendation-app\frontend\src\MovieSearch.js
import React, { useState } from 'react';

function MovieSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');

  const handleSearch = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const params = new URLSearchParams({ query, year });
      const res = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/movies/search?${params}`
      );
      const data = await res.json();
      setResults(data.results || []);
      if (!data.results || data.results.length === 0) setMessage('No movies found.');
    } catch {
      setMessage('Search error');
    }
  };

  return (
    <div className="container mt-4">
      <form className="row g-2" onSubmit={handleSearch}>
        <div className="col">
          <input className="form-control" placeholder="Title" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div className="col">
          <input className="form-control" placeholder="Year" value={year} onChange={e => setYear(e.target.value)} />
        </div>
        <div className="col-auto">
          <button className="btn btn-primary" type="submit">Search</button>
        </