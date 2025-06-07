import React, { useState } from 'react';
import logo from './logo.svg';
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
import AddMovieToWatchlist from './AddMovieToWatchlist';

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
    <div className="App">
      <header className="bg-dark text-white p-3 mb-4">
        <div className="container d-flex flex-wrap align-items-center justify-content-between">
          <h1 className="mb-0">Movie Recommendation App</h1>
          <nav>
            {!isAuthenticated && (
              <>
                <button className="btn btn-outline-light me-2" onClick={() => setView('login')}>Login</button>
                <button className="btn btn-outline-light" onClick={() => setView('register')}>Register</button>
              </>
            )}
            {isAuthenticated && (
              <>
                <button className="btn btn-outline-light me-2" onClick={handleLogout}>Logout</button>
                <button className="btn btn-outline-light me-2" onClick={() => setView('profile')}>Profile</button>
                <button className="btn btn-outline-light me-2" onClick={() => setView('movies')}>Movies</button>
                <button className="btn btn-outline-light" onClick={() => setView('recommendations')}>Recommendations</button>
              </>
            )}
          </nav>
        </div>
      </header>
      <main>
        {!isAuthenticated && view === 'login' && <Login onLogin={handleLogin} />}
        {!isAuthenticated && view === 'register' && <Register />}
        {isAuthenticated && view === 'profile' && <Profile />}
        {isAuthenticated && view === 'movies' && <MovieList />}
        {isAuthenticated && view === 'recommendations' && <Recommendations />}
        {isAuthenticated && view !== 'profile' && view !== 'movies' && view !== 'recommendations' && <div className="container mt-4"><h2>Welcome! You are logged in.</h2></div>}
        <div>
          {!selectedMovie ? (
            <MovieSearch onSelect={setSelectedMovie} />
          ) : (
            <MovieDetails movieId={selectedMovie} onBack={() => setSelectedMovie(null)} />
          )}
        </div>
        <FavoritesList />
        <Watchlists />
      </main>
    </div>
  );
}

export default App;

function MovieDetails({ movieId, onBack }) {
  // ...fetch movie logic...
  return (
    <div>
      {/* ...movie info... */}
      <AddMovieToWatchlist movie={movie} />
    </div>
  );
}
