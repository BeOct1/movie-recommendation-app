import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MovieList from '../MovieList';
import MovieSearch from '../MovieSearch';
import Recommendations from '../Recommendations';

global.fetch = jest.fn();

describe('Movie discovery and recommendation flows', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('MovieList fetches and displays movies', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [
          { id: 1, title: 'Movie One', vote_average: 7.5, release_date: '2023-01-01', poster_path: '/path1.jpg' },
          { id: 2, title: 'Movie Two', vote_average: 8.0, release_date: '2022-05-15', poster_path: '/path2.jpg' },
        ],
      }),
    });

    render(<MovieList />);

    expect(screen.getByText(/movie discovery/i)).toBeInTheDocument();

    expect(await screen.findByText('Movie One')).toBeInTheDocument();
    expect(await screen.findByText('Movie Two')).toBeInTheDocument();
  });

  test('MovieSearch performs search and displays results', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        results: [
          { id: 3, title: 'Search Movie', vote_average: 6.5, release_date: '2021-07-20', poster_path: '/path3.jpg' },
        ],
      }),
    });

    const setSelectedMovie = jest.fn();

    render(<MovieSearch setSelectedMovie={setSelectedMovie} />);

    fireEvent.change(screen.getByLabelText(/search by title/i), { target: { value: 'Search' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(await screen.findByText('Search Movie')).toBeInTheDocument();
  });

  test('Recommendations fetch and display recommended movies', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { _id: 'abc123', title: 'Recommended Movie', year: 2023, posterUrl: 'http://example.com/poster.jpg' },
      ],
    });

    render(<Recommendations />);

    expect(await screen.findByText(/recommended movies/i)).toBeInTheDocument();
    expect(await screen.findByText('Recommended Movie')).toBeInTheDocument();
  });
});
