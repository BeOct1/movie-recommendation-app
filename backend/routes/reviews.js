const express = require('express');
const Review = require('../models/Review');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Add review
router.post(
  '/',
  auth,
  [
    body('movieId').notEmpty().withMessage('movieId is required'),
    body('rating').isInt({ min: 1, max: 10 }).withMessage('Rating must be between 1 and 10'),
    body('comment').optional().isLength({ max: 500 }).withMessage('Comment max length is 500'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { movieId, rating, comment } = req.body;
    try {
      const review = new Review({ user: req.user.userId, movieId, rating, comment });
      await review.save();
      res.status(201).json(review);
    } catch (err) {
      res.status(500).json({ message: 'Error saving review' });
    }
  }
);

// Get reviews for a movie
router.get('/:movieId', async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId }).populate('user', 'username');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Get reviews by user
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.userId }).populate('movieId', 'title');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user reviews' });
  }
});

module.exports = router;