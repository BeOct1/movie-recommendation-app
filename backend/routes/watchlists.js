const express = require('express');
const Watchlist = require('../models/Watchlist');
const auth = require('../middleware/auth');
const router = express.Router();

// Create watchlist
router.post('/', auth, async (req, res) => {
  const { name } = req.body;
  try {
    const wl = new Watchlist({ user: req.user.userId, name, movies: [] });
    await wl.save();
    res.status(201).json(wl);
  } catch (err) {
    res.status(500).json({ message: 'Error creating watchlist' });
  }
});

// Add movie to watchlist
router.post('/:id/movies', auth, async (req, res) => {
  const { movieId, title, posterPath } = req.body;
  try {
    const wl = await Watchlist.findOne({ _id: req.params.id, user: req.user.userId });
    if (!wl) return res.status(404).json({ message: 'Watchlist not found' });
    wl.movies.push({ movieId, title, posterPath });
    await wl.save();
    res.json(wl);
  } catch (err) {
    res.status(500).json({ message: 'Error adding movie to watchlist' });
  }
});

// Get all watchlists
router.get('/', auth, async (req, res) => {
  try {
    const wls = await Watchlist.find({ user: req.user.userId });
    res.json(wls);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching watchlists' });
  }
});

module.exports = router;