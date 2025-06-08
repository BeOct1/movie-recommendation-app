const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const User = require('../models/User');

const router = express.Router();

// Helper to generate refresh token
function generateRefreshToken() {
  return crypto.randomBytes(40).toString('hex');
}

// Register
router.post(
  '/register',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      console.log('Register request body:', req.body);

      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        console.log('Missing username, email, or password');
        return res.status(400).json({ message: 'All fields required' });
      }

      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        console.log('Username or email already exists');
        return res.status(409).json({ message: 'Username or email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
      // Issue tokens
      const accessToken = jwt.sign(
        { userId: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      const refreshToken = generateRefreshToken();
      user.refreshTokens = user.refreshTokens || [];
      user.refreshTokens.push(refreshToken);
      await user.save();
      res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'Strict', secure: process.env.NODE_ENV === 'production', maxAge: 7*24*60*60*1000 });
      res.status(201).json({ message: 'User registered successfully', token: accessToken, user: { username: user.username, email: user.email, _id: user._id } });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      // Issue tokens
      const accessToken = jwt.sign(
        { userId: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      const refreshToken = generateRefreshToken();
      user.refreshTokens = user.refreshTokens || [];
      user.refreshTokens.push(refreshToken);
      await user.save();
      res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'Strict', secure: process.env.NODE_ENV === 'production', maxAge: 7*24*60*60*1000 });
      res.json({ token: accessToken, user: { username: user.username, email: user.email, _id: user._id } });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ message: 'No refresh token' });
  }
  // Find user with this refresh token
  const user = await User.findOne({ refreshTokens: refreshToken });
  if (!user) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
  const accessToken = jwt.sign(
    { userId: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  res.json({ token: accessToken });
});

// Logout: clear refresh token
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.cookies;
  if (refreshToken) {
    // Remove refresh token from user's array
    await User.updateOne({ refreshTokens: refreshToken }, { $pull: { refreshTokens: refreshToken } });
    res.clearCookie('refreshToken');
  }
  res.json({ message: 'Logged out' });
});

module.exports = router;
