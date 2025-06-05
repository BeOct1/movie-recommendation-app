import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Register from './Register';
import Login from './Login';
import Profile from './Profile';
import MovieList from './MovieList';
import Recommendations from './Recommendations';

function App() {
  const [view, setView] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

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
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Movie Recommendation App</h1>
        {!isAuthenticated && (
          <>
            <button onClick={() => setView('login')}>Login</button>
            <button onClick={() => setView('register')}>Register</button>
          </>
        )}
        {isAuthenticated && (
          <button onClick={handleLogout}>Logout</button>
        )}
      </header>
      <main>
        {!isAuthenticated && view === 'login' && <Login onLogin={handleLogin} />}
        {!isAuthenticated && view === 'register' && <Register />}
        {isAuthenticated && view === 'profile' && <Profile />}
        {isAuthenticated && view === 'movies' && <MovieList />}
        {isAuthenticated && view === 'recommendations' && <Recommendations />}
        {isAuthenticated && view !== 'profile' && view !== 'movies' && view !== 'recommendations' && <div><h2>Welcome! You are logged in.</h2></div>}
      </main>
      <nav>
        {isAuthenticated && (
          <>
            <button onClick={() => setView('profile')}>Profile</button>
            <button onClick={() => setView('movies')}>Movies</button>
            <button onClick={() => setView('recommendations')}>Recommendations</button>
          </>
        )}
      </nav>
    </div>
  );
}

export default App;
