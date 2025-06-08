const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('../models/User'); // Adjust the path as necessary

app.use(express.json());
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
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Update User schema:
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: Number }], // store TMDB movie IDs
  watchlists: [
    {
      name: { type: String, required: true },
      movies: [{ type: Number }]
    }
  ],
  reviews: [
    {
      movieId: { type: Number, required: true },
      rating: { type: Number, min: 1, max: 10 },
      comment: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

const User = mongoose.model('User', UserSchema);

// Get user profile
app.get('/api/user/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id, '-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile (e.g., username)
app.put('/api/user/profile', authMiddleware, async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: 'Username required' });

    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== req.user.id) {
      return res.status(400).json({ message: 'Username taken' });
    }

    const user = await User.findByIdAndUpdate(req.user.id,
      { username },
      { new: true, select: '-password' }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add movie to favorites
app.post('/api/user/favorites', authMiddleware, async (req, res) => {
  try {
    const { movieId } = req.body;
    if (!movieId) return res.status(400).json({ message: 'movieId required' });

    const user = await User.findById(req.user.id);
    if (user.favorites.includes(movieId)) {
      return res.status(400).json({ message: 'Movie already in favorites' });
    }
    user.favorites.push(movieId);
    await user.save();
    res.json({ message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove movie from favorites
app.delete('/api/user/favorites/:movieId', authMiddleware, async (req, res) => {
  try {
    const movieId = Number(req.params.movieId);
    const user = await User.findById(req.user.id);
    user.favorites = user.favorites.filter(m => m !== movieId);
    await user.save();
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = authMiddleware;
