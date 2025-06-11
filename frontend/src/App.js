import React, { useState, useEffect } from 'react';
import Register from './Register';
import Login from './Login';
import Profile from './Profile';
import MovieList from './MovieList';
import Recommendations from './Recommendations';
import MovieSearch from './MovieSearch';
import MovieDetails from './MovieDetails';
import FavoritesList from './FavoritesList';
import Watchlists from './Watchlists';
import { AuthProvider, AuthContext } from './AuthContext';
import { MovieCacheProvider } from './MovieCacheContext';
import { NotificationProvider } from './NotificationContext';
import AuthModal from './AuthModal';
import './App.css';

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <NotificationProvider>
      <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle dark/light mode">
        {theme === 'dark' ? '🌞' : '🌙'}
      </button>
      <AuthProvider>
        <MovieCacheProvider>
          <MainApp />
        </MovieCacheProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

function MainApp() {
  const { isAuthenticated, user, login, logout } = React.useContext(AuthContext);
  const [view, setView] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Sticky header with logo and navigation
  const renderHeader = () => (
    <header className="modern-header">
      <div className="container d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <img src="/favicon.ico" alt="Logo" className="modern-logo" />
          <span className="modern-title"> Movie Recommendations App |By Bitrus Edward</span>
        </div>
        <nav className="modern-nav">
          {isAuthenticated ? (
            <>
              <button className="btn btn-link text-secondary" onClick={() => setView('profile')}>Dashboard</button>
              <button className="btn btn-link text-secondary" onClick={() => setView('movies')}>Movies</button>
              <button className="btn btn-link text-secondary" onClick={() => setView('search')}>Search</button>
              <button className="btn btn-link text-secondary" onClick={() => setView('favorites')}>Favorites</button>
              <button className="btn btn-link text-secondary" onClick={() => setView('watchlists')}>Watchlists</button>
              <div className="dropdown">
                <button className="btn btn-link dropdown-toggle text-secondary" data-bs-toggle="dropdown">
                  {user?.username || 'Profile'}
                </button>
                <ul className="dropdown-menu">
                  <li><button className="dropdown-item" onClick={() => setView('profile')}>Profile</button></li>
                  <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <button className="btn btn-link text-secondary" onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}>Login</button>
              <button className="btn btn-link text-secondary" onClick={() => { setAuthMode('register'); setShowAuthModal(true); }}>Sign Up</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );

  // Modern hero section
  const renderHero = () => (
    <section className="modern-hero">
      <div className="modern-hero-card">
        <div className="modern-hero-bg" />
        <div className="modern-hero-content">
          <div className="modern-hero-top">
            <span className="modern-netflix">N</span>
            <nav className="modern-hero-nav">
              <span>Top Cast</span>
              <span>Photos</span>
              <span>Videos</span>
              <span>Similar Movies</span>
            </nav>
          </div>
          <div className="modern-hero-main">
            <h1 className="modern-hero-title">Dune</h1>
            <div className="modern-hero-meta">
              <span className="modern-hero-rating">8.2 ★</span>
              <span>2h 35m</span>
              <span>Action, Adventure, Sci-Fi</span>
            </div>
            <p className="modern-hero-desc">A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes troubled by visions of a dark future.</p>
            <div className="modern-hero-buttons">
              <button className="modern-hero-play">PLAY NOW</button>
              <button className="modern-hero-trailer">TRAILER</button>
            </div>
          </div>
          <div className="modern-hero-cast">
            <span>Posters</span>
            <div className="modern-hero-cast-list">
              {/* Example avatars, replace with real data if available */}
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Cast" />
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Cast" />
              <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Cast" />
              <img src="https://randomuser.me/api/portraits/women/46.jpg" alt="Cast" />
              <img src="https://randomuser.me/api/portraits/men/47.jpg" alt="Cast" />
            </div>
            <div className="modern-hero-cast-names">
              <span>Timothée Chalamet</span>
              <span>Rebecca Ferguson</span>
              <span>Oscar Isaac</span>
              <span>Zendaya</span>
              <span>Javier Bardem</span>
              <span>VIEW ALL</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // List of protected views
  const protectedViews = [
    'profile', 'movies', 'recommendations', 'search', 'favorites', 'watchlists', 'details'
  ];

  if (!isAuthenticated && protectedViews.includes(view)) {
    setTimeout(() => setView('home'), 0);
    return null;
  }

  return (
    <div className="app-bg min-vh-100 d-flex flex-column">
      {renderHeader()}
      <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
        {view === 'home' && renderHero()}
        {isAuthenticated ? (
          <div style={{ width: '100%' }}>
            {view === 'profile' && <Profile />}
            {view === 'movies' && <MovieList />}
            {view === 'recommendations' && <Recommendations />}
            {view === 'search' && <MovieSearch setSelectedMovie={setSelectedMovie} />}
            {view === 'details' && <MovieDetails movie={selectedMovie} />}
            {view === 'favorites' && <FavoritesList />}
            {view === 'watchlists' && <Watchlists />}
          </div>
        ) : null}
        <AuthModal show={showAuthModal} onClose={() => setShowAuthModal(false)}>
          {authMode === 'login' ? (
            <div className="auth-card p-4 rounded-4 shadow-lg mx-auto" style={{ maxWidth: 500, width: '100%' }}>
              <h2 className="text-center mb-3 fw-bold text-warning">Sign In</h2>
              <Login onLogin={() => { login(); setShowAuthModal(false); }} />
              <div className="text-center mt-3">
                <span className="text-secondary">Don't have an account? </span>
                <button className="btn btn-link text-warning p-0" onClick={() => setAuthMode('register')}>Register</button>
              </div>
            </div>
          ) : (
            <div className="auth-card p-4 rounded-4 shadow-lg mx-auto" style={{ maxWidth: 500, width: '100%' }}>
              <h2 className="text-center mb-3 fw-bold text-warning">Create Account</h2>
              <Register />
              <div className="text-center mt-3">
                <span className="text-secondary">Already have an account? </span>
                <button className="btn btn-link text-warning p-0" onClick={() => setAuthMode('login')}>Login</button>
              </div>
            </div>
          )}
        </AuthModal>
      </main>
      <footer className="text-center text-secondary py-3 small" style={{ background: '#f8fafc' }}>
        <span>&copy; {new Date().getFullYear()} 3MTT | BeTech Solution</span>
      </footer>
    </div>
  );
}

export default App;

