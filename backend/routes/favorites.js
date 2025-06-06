const express = require('express');
const Favorite = require('../models/Favorite');
const auth = require('../middleware/auth');
const router = express.Router();

// Add favorite
router.post('/', auth, async (req, res) => {
  const { movieId, title, posterPath } = req.body;
  try {
    const fav = new Favorite({ user: req.user.userId, movieId, title, posterPath });
    await fav.save();
    res.status(201).json(fav);
  } catch (err) {
    res.status(500).json({ message: 'Error saving favorite' });
  }
});

// Get favorites
router.get('/', auth, async (req, res) => {
  try {
    const favs = await Favorite.find({ user: req.user.userId });
    res.json(favs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching favorites' });
  }
});

// Remove favorite
router.delete('/:id', auth, async (req, res) => {
  try {
    await Favorite.deleteOne({ user: req.user.userId, movieId: req.params.id });
    res.json({ message: 'Favorite removed' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing favorite' });
  }
});

module.exports = router;