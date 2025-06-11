import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import FavoritesList from '../FavoritesList';
import { AuthContext } from '../AuthContext';
import { NotificationContext } from '../NotificationContext';

global.fetch = jest.fn();

const mockNotify = jest.fn();

const renderWithContext = (ui, { token }) => {
  return render(
    <AuthContext.Provider value={{ token }}>
      <NotificationContext.Provider value={{ notify: mockNotify }}>
        {ui}
      </NotificationContext.Provider>
    </AuthContext.Provider>
  );
};

describe('FavoritesList component', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNotify.mockClear();
  });

  test('fetches and displays favorites', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { movieId: '1', title: 'Favorite Movie 1' },
        { movieId: '2', title: 'Favorite Movie 2' },
      ],
    });

    renderWithContext(<FavoritesList />, { token: 'test-token' });

    expect(screen.getByText(/loading favorites/i)).toBeInTheDocument();

    expect(await screen.findByText('Favorite Movie 1')).toBeInTheDocument();
    expect(await screen.findByText('Favorite Movie 2')).toBeInTheDocument();
  });

  test('removes a favorite', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { movieId: '1', title: 'Favorite Movie 1' },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Favorite removed' }),
      });

    renderWithContext(<FavoritesList />, { token: 'test-token' });

    await waitFor(() => screen.getByText('Favorite Movie 1'));

    fireEvent.click(screen.getByText(/remove/i));

    expect(mockNotify).toHaveBeenCalledWith('Favorite removed', 'success');
    await waitFor(() => {
      expect(screen.queryByText('Favorite Movie 1')).not.toBeInTheDocument();
    });
  });

  test('handles fetch error', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    renderWithContext(<FavoritesList />, { token: 'test-token' });

    expect(mockNotify).toHaveBeenCalledWith('Failed to fetch favorites', 'error');
  });
});
