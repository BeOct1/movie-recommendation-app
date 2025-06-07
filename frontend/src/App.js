import React, { useState } from 'react';
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
        <span>&copy; {new Date().getFullYear()} MovieVerse <span role="img" aria-label="clapper">🎬</span> | Built with <span className="text-danger">♥</span> by Ndutech</span>
        <div className="text-secondary mt-1" style={{fontSize: '0.9em'}}>movie-app-frontend-rye9.vercel.app</div>
      </footer>
    </div>
  );
}

export default App;
