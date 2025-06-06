require('dotenv').config();
const express = require('express');
const Movie = require('../models/Movie');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Middleware to check JWT
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Add a new movie (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, genre, year, description, posterUrl } = req.body;
    const movie = new Movie({ title, genre, year, description, posterUrl });
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all movies or search by title/genre
router.get('/', async (req, res) => {
  try {
    const { search, genre } = req.query;
    let query = {};
    if (search) query.title = { $regex: search, $options: 'i' };
    if (genre) query.genre = genre;
    const movies = await Movie.find(query);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Recommend movies (simple: random 5)
router.get('/recommendations', authMiddleware, async (req, res) => {
  try {
    const count = await Movie.countDocuments();
    const random = Math.max(0, Math.floor(Math.random() * (count - 5)));
    const movies = await Movie.find().skip(random).limit(5);
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Search movies
router.get('/search', async (req, res) => {
  try {
    const { query, year, genre, sort_by } = req.query;
    const params = {
      api_key: TMDB_API_KEY,
      query,
      year,
      with_genres: genre,
      sort_by,
      language: 'en-US',
      include_adult: false,
      page: 1,
    };
    const tmdbRes = await axios.get('https://api.themoviedb.org/3/search/movie', { params });
    res.json(tmdbRes.data);
  } catch (err) {
    res.status(500).json({ message: 'TMDB search error', error: err.message });
  }
});

// Movie details
router.get('/:id', async (req, res) => {
  try {
    const tmdbRes = await axios.get(
      `https://api.themoviedb.org/3/movie/${req.params.id}`,
      { params: { api_key: TMDB_API_KEY, language: 'en-US' } }
    );
    res.json(tmdbRes.data);
  } catch (err) {
    res.status(500).json({ message: 'TMDB details error', error: err.message });
  }
});

module.exports = router;
