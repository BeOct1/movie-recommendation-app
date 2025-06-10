require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moviesRouter = require('./routes/movies');
const favoritesRouter = require('./routes/favorites');
const watchlistsRouter = require('./routes/watchlists');
const reviewsRouter = require('./routes/reviews');
const profileRouter = require('./routes/profile');
const { MongoClient, ServerApiVersion } = require('mongodb');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'movie-recommendation-fu9npnm5g-edwards-projects-0bb04786.vercel.app',
    'http://localhost:5000'
  ]
}));
app.use(express.json());

// MongoDB connection
const uri = "mongodb+srv://bitrusmail:7gXJHQGiPR9mfBab@cluster0.1sgoxgf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectMongo() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}
connectMongo();

// Middleware to check JWT

//const getHttpsConfig = require('./getHttpsConfig');
// Registration route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
    const usersCol = client.db().collection('users');
    const existingUser = await usersCol.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await usersCol.insertOne({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Login route

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
    const usersCol = client.db().collection('users');
    const user = await usersCol.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// Add a protected profile route

app.get('/api/auth/profile', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usersCol = client.db().collection('users');
    const user = await usersCol.findOne({ _id: require('mongodb').ObjectId(decoded.userId) }, { projection: { password: 0 } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Import routes

app.use('/api/movies', moviesRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/watchlists', watchlistsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/profile', profileRouter);

app.get('/', (req, res) => {
  res.send('Express server is running!');
});

// Export app for testing and for use in start.js
module.exports = app;
module.exports.client = client;
module.exports.connectMongo = connectMongo;
// To run the server in production, use start.js
