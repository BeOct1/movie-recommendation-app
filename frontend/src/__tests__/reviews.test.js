import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Reviews from '../Reviews';
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

describe('Reviews component', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNotify.mockClear();
  });

  test('fetches and displays reviews', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { _id: 'rev1', rating: 8, comment: 'Great movie!' },
        { _id: 'rev2', rating: 7, comment: 'Good watch' },
      ],
    });

    renderWithContext(<Reviews movieId="test-movie" />, { token: 'test-token' });

    expect(screen.getByText(/loading reviews/i)).toBeInTheDocument();

    expect(await screen.findByText('Great movie!')).toBeInTheDocument();
    expect(await screen.findByText('Good watch')).toBeInTheDocument();
  });

  test('adds a new review', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { _id: 'rev1', rating: 8, comment: 'Great movie!' },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ _id: 'rev3', rating: 9, comment: 'Awesome!' }),
      });

    renderWithContext(<Reviews movieId="test-movie" />, { token: 'test-token' });

    expect(await screen.findByText('Great movie!')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/rating/i), { target: { value: '9' } });
    fireEvent.change(screen.getByLabelText(/comment/i), { target: { value: 'Awesome!' } });
    fireEvent.click(screen.getByRole('button', { name: /submit review/i }));

    expect(mockNotify).toHaveBeenCalledWith('Review added', 'success');
    expect(await screen.findByText('Awesome!')).toBeInTheDocument();
  });

  test('handles fetch error', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
    });

    renderWithContext(<Reviews movieId="test-movie" />, { token: 'test-token' });

    expect(mockNotify).toHaveBeenCalledWith('Failed to fetch reviews', 'error');
  });
});
