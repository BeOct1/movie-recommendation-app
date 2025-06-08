import React, { createContext, useState } from 'react';

export const MovieCacheContext = createContext();

export function MovieCacheProvider({ children }) {
  const [movieCache, setMovieCache] = useState({});

  const cacheMovie = (id, data) => {
    setMovieCache(prev => ({ ...prev, [id]: data }));
  };

  return (
    <MovieCacheContext.Provider value={{ movieCache, cacheMovie }}>
      {children}
    </MovieCacheContext.Provider>
  );
}
