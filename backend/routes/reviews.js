const express = require('express');
const Review = require('../models/Review');
const auth = require('../middleware/auth');
const router = express.Router();

// Add review
router.post('/', auth, async (req, res) => {
  const { movieId, rating, comment } = req.body;
  try {
    const review = new Review({ user: req.user.userId, movieId, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Error saving review' });
  }
});

// Get reviews for a movie
router.get('/:movieId', async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId }).populate('user', 'username');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

module.exports = router;