const express = require('express');
const Movie = require('../models/Movie');
const jwt = require('jsonwebtoken');

const router = express.Router();

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

module.exports = router;
