const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const { getDb } = require('../db');
const { ObjectId } = require('mongodb');

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
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields required' });
      }
      const usersCol = getDb().collection('users');
      const existingUser = await usersCol.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        return res.status(409).json({ message: 'Username or email already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await usersCol.insertOne({ username, email, password: hashedPassword, refreshTokens: [] });
      const user = result.ops ? result.ops[0] : { _id: result.insertedId, username, email, refreshTokens: [] };
      const accessToken = jwt.sign(
        { userId: user._id.toString(), username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      const refreshToken = generateRefreshToken();
      await usersCol.updateOne({ _id: user._id }, { $push: { refreshTokens: refreshToken } });
      res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'Strict', secure: process.env.NODE_ENV === 'production', maxAge: 7*24*60*60*1000 });
      res.status(201).json({ message: 'User registered successfully', token: accessToken, user: { username: user.username, email: user.email, _id: user._id } });
    } catch (err) {
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
      const usersCol = getDb().collection('users');
      const user = await usersCol.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const accessToken = jwt.sign(
        { userId: user._id.toString(), username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      const refreshToken = generateRefreshToken();
      await usersCol.updateOne({ _id: user._id }, { $push: { refreshTokens: refreshToken } });
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
  const usersCol = getDb().collection('users');
  const user = await usersCol.findOne({ refreshTokens: refreshToken });
  if (!user) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
  const accessToken = jwt.sign(
    { userId: user._id.toString(), username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  res.json({ token: accessToken });
});

// Logout: clear refresh token
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.cookies;
  if (refreshToken) {
    const usersCol = getDb().collection('users');
    await usersCol.updateOne({ refreshTokens: refreshToken }, { $pull: { refreshTokens: refreshToken } });
    res.clearCookie('refreshToken');
  }
  res.json({ message: 'Logged out' });
});

module.exports = router;
