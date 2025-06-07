import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Register from './Register';
import Login from './Login';
import Profile from './Profile';
import MovieList from './MovieList';
import Recommendations from './Recommendations';
import MovieSearch from './MovieSearch';
import MovieDetails from './MovieDetails';
import FavoritesList from './FavoritesList';
import Watchlists from './Watchlists';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
  useNavigate,
  useParams
} from 'react-router-dom';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <nav style={styles.nav}>
        <Link to="/" style={styles.link}>Home</Link>
        {token && <Link to="/discover" style={styles.link}>Discover</Link>}
        {!token && (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
        {token && <button onClick={logout} style={styles.button}>Logout</button>}
      </nav>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute token={token}>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/discover" element={
          <ProtectedRoute token={token}>
            <MovieDiscover />
          </ProtectedRoute>
        } />
        <Route path="/movie/:id" element={
          <ProtectedRoute token={token}>
            <MovieDetail />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

// Authentication components unchanged (Register, Login, Home)...

// Protect routes needing authentication
function ProtectedRoute({ token, children }) {
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
}

function Home() {
  return (
    <div style={styles.container}>
      <h1>Welcome to Movie Recommendation App</h1>
      <p>You are logged in!</p>
      <p>Go to <Link to='/discover'>Discover Movies</Link> to start exploring!</p>
    </div>
  );
}

// Movie Discovery Component
function MovieDiscover() {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [rating, setRating] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch genres on mount
  useEffect(() => {
    axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
      params: { api_key: TMDB_API_KEY, language: 'en-US' }
    })
      .then(res => setGenres(res.data.genres))
      .catch(() => setError('Failed to load genres'));
  }, []);

  // Search or discover movies based on filters
  const fetchMovies = () => {
    setError('');
    if (query.trim() !== '') {
      // Search movies by query + filters
      axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          query,
          include_adult: false,
          year: year || undefined,
          sort_by: sortBy,
        }
      }).then(res => {
        let data = res.data.results;
        // Filter by genre and rating client-side
        if (selectedGenre) {
          data = data.filter(m => m.genre_ids.includes(Number(selectedGenre)));
        }
        if (rating) {
          data = data.filter(m => m.vote_average >= Number(rating));
        }
        setMovies(data);
      }).catch(() => setError('Failed to fetch search results'));
    } else {
      // Discover keywords only by filters
      axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          with_genres: selectedGenre || undefined,
          'vote_average.gte': rating || undefined,
          primary_release_year: year || undefined,
          sort_by: sortBy,
          include_adult: false,
        }
      }).then(res => setMovies(res.data.results))
        .catch(() => setError('Failed to fetch movies'));
    }
  };

  // Fetch movies initially
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Discover Movies</h2>
      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by title..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={styles.input}
        />
        <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)} style={styles.select}>
          <option value="">All Genres</option>
          {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <input
          type="number"
          min="1900"
          max="2024"
          placeholder="Year"
          value={year}
          onChange={e => setYear(e.target.value)}
          style={{ ...styles.input, maxWidth: 90 }}
        />
        <select value={rating} onChange={e => setRating(e.target.value)} style={styles.select}>
          <option value="">Min Rating</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(r =>
            <option key={r} value={r}>{r}+</option>
          )}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={styles.select}>
          <option value="popularity.desc">Popularity Desc</option>
          <option value="popularity.asc">Popularity Asc</option>
          <option value="release_date.desc">Newest</option>
          <option value="release_date.asc">Oldest</option>
          <option value="vote_average.desc">Rating Desc</option>
          <option value="vote_average.asc">Rating Asc</option>
        </select>
        <button onClick={fetchMovies} style={styles.button}>Search</button>
      </div>
      {error && <p style={styles.error}>{error}</p>}
      <div style={styles.movieGrid}>
        {movies.length === 0 && <p>No movies found</p>}
        {movies.map(m => (
          <div key={m.id} style={styles.movieCard} onClick={() => navigate(`/movie/${m.id}`)}>
            {m.poster_path ? (
              <img src={`https://image.tmdb.org/t/p/w200${m.poster_path}`} alt={m.title} style={{ width: '100%', borderRadius: 8 }} />
            ) : (
              <div style={{ ...styles.posterPlaceholder }}>No Image</div>
            )}
            <h3 style={{ margin: '8px 0' }}>{m.title}</h3>
            <p>Rating: {m.vote_average}</p>
            <p>Release: {m.release_date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Movie Detail component
function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
      params: { api_key: TMDB_API_KEY, language: 'en-US' }
    }).then(res => {
      setMovie(res.data);
    }).catch(() => setError('Failed to load movie details'));
  }, [id]);

  if (error) return <p style={styles.error}>{error}</p>;
  if (!movie) return <p>Loading movie details...</p>;

  return (
    <div style={styles.container}>
      <h2>{movie.title}</h2>
      <div style={{ display: 'flex', gap: 20 }}>
        {movie.poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={movie.title}
            style={{ borderRadius: 10 }}
          />
        )}
        <div>
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Rating:</strong> {movie.vote_average} ({movie.vote_count} votes)</p>
          <p><strong>Genres:</strong> {movie.genres.map(g => g.name).join(', ')}</p>
          <p><strong>Overview:</strong><br />{movie.overview}</p>
          {movie.homepage && (
            <p><a href={movie.homepage} target="_blank" rel="noopener noreferrer">Official Website</a></p>
          )}
        </div>
      </div>
      <Link to="/discover" style={{ ...styles.link, display: 'inline-block', marginTop: 20 }}>
        &larr; Back to Discover
      </Link>
    </div>
  );
}

const styles = {
  nav: {
    backgroundColor: '#222',
    display: 'flex',
    padding: '10px',
    gap: '10px'
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer'
  },
  container: {
    maxWidth: 900,
    margin: '40px auto',
    padding: 20,
    border: '1px solid #ddd',
    borderRadius: 8
  },
  filters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
    alignItems: 'center'
  },
  input: {
    padding: 10,
    fontSize: 16,
    flexGrow: 1,
    minWidth: 160
  },
  select: {
    padding: 10,
    fontSize: 16,
    minWidth: 120
  },
  movieGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))',
    gap: 20
  },
  movieCard: {
    cursor: 'pointer',
    border: '1px solid #ddd',
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0 2px 8px',
    backgroundColor: '#fff'
  },
  posterPlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: '#ccc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#666',
    fontSize: 16
  },
  error: {
    color: 'red',
    marginTop: 10
  }
};

export default App;


function App() {
  const [view, setView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setView('profile');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setView('login');
  };

  return (
    <div className="app-bg min-vh-100 d-flex flex-column justify-content-between">
      <main className="flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="auth-card p-4 rounded-4 shadow-lg mx-auto" style={{maxWidth: 400, width: '100%'}}>
          {view === 'register' ? (
            <>
              <h2 className="text-center mb-3 fw-bold text-warning">Create Account</h2>
              <Register />
              <div className="text-center mt-3">
                <span className="text-light">Already have an account? </span>
                <button className="btn btn-link text-warning p-0" onClick={() => setView('login')}>Login</button>
              </div>
            </>
          ) : view === 'login' ? (
            <>
              <h2 className="text-center mb-3 fw-bold text-warning">Sign In</h2>
              <Login onLogin={handleLogin} />
              <div className="text-center mt-3">
                <span className="text-light">Don't have an account? </span>
                <button className="btn btn-link text-warning p-0" onClick={() => setView('register')}>Register</button>
              </div>
            </>
          ) : isAuthenticated ? (
            <>
              {view === 'profile' && <Profile />}
              {view === 'movies' && <MovieList />}
              {view === 'recommendations' && <Recommendations />}
              <div className="d-flex flex-column gap-3 mt-4">
                <FavoritesList />
                <Watchlists />
              </div>
              <button className="btn btn-outline-warning w-100 mt-3" onClick={handleLogout}>Logout</button>
            </>
          ) : null}
        </div>
      </main>
      <footer className="text-center text-light py-3 small">
        <span>&copy; {new Date().getFullYear()} 3MTT | BeTech Solution</span>
      </footer>
    </div>
  );
}

export default App;
