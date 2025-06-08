import React, { useState } from 'react';
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
import './App.css';

function App() {
  return (
    <AuthProvider>
      <MovieCacheProvider>
        <MainApp />
      </MovieCacheProvider>
    </AuthProvider>
  );
}

function MainApp() {
  const { isAuthenticated, user, login, logout } = React.useContext(AuthContext);
  const [view, setView] = useState(isAuthenticated ? 'profile' : 'login');
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Sticky header with logo and navigation
  const renderHeader = () => (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '0.5rem 0', marginBottom: 24
    }}>
      <div className="container d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <img src="/favicon.ico" alt="Logo" style={{ width: 40, height: 40, borderRadius: 8, marginRight: 8 }} />
          <span style={{ fontWeight: 800, fontSize: 28, color: '#222', letterSpacing: 1 }}>MovieRec</span>
        </div>
        <nav style={{ display: 'flex', gap: 16 }}>
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
              <button className="btn btn-link text-secondary" onClick={() => setView('login')}>Login</button>
              <button className="btn btn-link text-secondary" onClick={() => setView('register')}>Sign Up</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );

  // Hero section for home page
  const renderHero = () => (
    <section style={{ background: '#f8fafc', padding: '4rem 0', textAlign: 'center' }}>
      <h1 style={{ fontSize: 56, fontWeight: 800, color: '#222', marginBottom: 16 }}>Discover Your Next Favorite Movie</h1>
      <p style={{ fontSize: 22, color: '#6b7280', marginBottom: 32 }}>Personalized recommendations, reviews, and watchlists. All in one place.</p>
      <button className="btn btn-warning btn-lg px-5 py-3 fw-bold" style={{ fontSize: 22, borderRadius: 32, transition: 'box-shadow 0.3s' }} onClick={() => setView(isAuthenticated ? 'movies' : 'register')}>Get Started</button>
    </section>
  );

  // List of protected views
  const protectedViews = [
    'profile', 'movies', 'recommendations', 'search', 'favorites', 'watchlists', 'details'
  ];

  // If user tries to access a protected view while not authenticated, redirect to login
  if (!isAuthenticated && protectedViews.includes(view)) {
    setTimeout(() => setView('login'), 0);
    return null;
  }

  return (
    <div className="app-bg min-vh-100 d-flex flex-column">
      {renderHeader()}
      <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
        {view === 'register' ? (
          <div className="auth-card p-4 rounded-4 shadow-lg mx-auto" style={{ maxWidth: 500, width: '100%' }}>
            <h2 className="text-center mb-3 fw-bold text-warning">Create Account</h2>
            <Register />
            <div className="text-center mt-3">
              <span className="text-secondary">Already have an account? </span>
              <button className="btn btn-link text-warning p-0" onClick={() => setView('login')}>Login</button>
            </div>
          </div>
        ) : view === 'login' ? (
          <div className="auth-card p-4 rounded-4 shadow-lg mx-auto" style={{ maxWidth: 500, width: '100%' }}>
            <h2 className="text-center mb-3 fw-bold text-warning">Sign In</h2>
            <Login onLogin={login} />
            <div className="text-center mt-3">
              <span className="text-secondary">Don't have an account? </span>
              <button className="btn btn-link text-warning p-0" onClick={() => setView('register')}>Register</button>
            </div>
          </div>
        ) : view === 'home' ? (
          renderHero()
        ) : isAuthenticated ? (
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
      </main>
      <footer className="text-center text-secondary py-3 small" style={{ background: '#f8fafc' }}>
        <span>&copy; {new Date().getFullYear()} 3MTT | BeTech Solution</span>
      </footer>
    </div>
  );
}

export default App;

