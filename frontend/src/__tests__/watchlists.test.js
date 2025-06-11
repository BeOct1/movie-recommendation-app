import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Watchlists from '../Watchlists';
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

describe('Watchlists component', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNotify.mockClear();
  });

  test('fetches and displays watchlists', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { _id: 'wl1', name: 'Watchlist 1', movies: [] },
        { _id: 'wl2', name: 'Watchlist 2', movies: [] },
      ],
    });

    renderWithContext(<Watchlists />, { token: 'test-token' });

    expect(screen.getByText(/loading watchlists/i)).toBeInTheDocument();

    expect(await screen.findByText('Watchlist 1')).toBeInTheDocument();
    expect(await screen.findByText('Watchlist 2')).toBeInTheDocument();
  });

  test('creates a new watchlist', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { _id: 'wl1', name: 'Watchlist 1', movies: [] },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _id: 'wl2', name: 'New Watchlist', movies: [] }),
      });

    renderWithContext(<Watchlists />, { token: 'test-token' });

    expect(await screen.findByText('Watchlist 1')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/new watchlist name/i), { target: { value: 'New Watchlist' } });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    expect(mockNotify).toHaveBeenCalledWith('Watchlist created', 'success');
    expect(await screen.findByText('New Watchlist')).toBeInTheDocument();
  });

  test('handles fetch error', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    renderWithContext(<Watchlists />, { token: 'test-token' });

    expect(mockNotify).toHaveBeenCalledWith('Failed to fetch watchlists', 'error');
  });
});
