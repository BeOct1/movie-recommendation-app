import axios from 'axios';

// Centralized Axios instance with JWT and error handling
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL + '/api'
    : 'http://localhost:5000/api',
  withCredentials: true, // for refresh token cookie
});

// Attach JWT from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Centralized error handler
export function handleApiError(error) {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  if (error.message) return error.message;
  return 'An error occurred.';
}

// --- FAVORITES ---
const favoritesCache = { list: null };
export async function getFavorites(force = false) {
  if (favoritesCache.list && !force) return favoritesCache.list;
  try {
    const { data } = await api.get('/favorites');
    favoritesCache.list = data;
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}
export async function addFavorite(movie) {
  try {
    const { data } = await api.post('/favorites', movie);
    favoritesCache.list = null; // Invalidate cache
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}
export async function removeFavorite(movieId) {
  try {
    const { data } = await api.delete(`/favorites/${movieId}`);
    favoritesCache.list = null;
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}

// --- WATCHLISTS ---
const watchlistsCache = { list: null };
export async function getWatchlists(force = false) {
  if (watchlistsCache.list && !force) return watchlistsCache.list;
  try {
    const { data } = await api.get('/watchlists');
    watchlistsCache.list = data;
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}
export async function createWatchlist(watchlist) {
  try {
    const { data } = await api.post('/watchlists', watchlist);
    watchlistsCache.list = null;
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}
export async function addMovieToWatchlist(watchlistId, movie) {
  try {
    const { data } = await api.post(`/watchlists/${watchlistId}/movies`, movie);
    watchlistsCache.list = null;
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}
export async function removeMovieFromWatchlist(watchlistId, movieId) {
  try {
    const { data } = await api.delete(`/watchlists/${watchlistId}/movies/${movieId}`);
    watchlistsCache.list = null;
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}

// --- REVIEWS ---
export async function getUserReviews(userId) {
  try {
    const { data } = await api.get(`/reviews/user/${userId}`);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}
export async function addReview(review) {
  try {
    const { data } = await api.post('/reviews', review);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}
export async function updateReview(id, review) {
  try {
    const { data } = await api.put(`/reviews/${id}`, review);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}
export async function deleteReview(id) {
  try {
    const { data } = await api.delete(`/reviews/${id}`);
    return data;
  } catch (error) {
    throw handleApiError(error);
  }
}