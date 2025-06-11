import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../Register';
import Login from '../Login';
import { AuthContext } from '../AuthContext';

global.fetch = jest.fn();

describe('Authentication flows', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('Register form submits valid data successfully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'fake-token', user: { username: 'testuser', email: 'test@example.com' } }),
    });

    const login = jest.fn();

    render(
      <AuthContext.Provider value={{ login }}>
        <Register />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => expect(login).toHaveBeenCalledWith(expect.any(Object), 'fake-token'));
    expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
  });

  test('Register form shows validation errors for invalid input', async () => {
    render(<Register />);

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  test('Login form submits valid credentials successfully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'fake-token', user: { username: 'testuser', email: 'test@example.com' } }),
    });

    const login = jest.fn();

    render(
      <AuthContext.Provider value={{ login }}>
        <Login />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => expect(login).toHaveBeenCalledWith(expect.any(Object), 'fake-token'));
  });

  test('Login form shows error for invalid credentials', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  // Additional tests for token refresh and logout would require mocking context and timers,
  // which can be added as needed.
});
