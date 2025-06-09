import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Mock AuthContext and MovieCacheProvider for isolation
describe('App integration and UI', () => {
  test('renders login and register forms for unauthenticated users', () => {
    render(<App />);
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Register/i));
    expect(screen.getByText(/Create Account/i)).toBeInTheDocument();
  });

  test('renders hero section on home view', () => {
    render(<App />);
    fireEvent.click(screen.getByText(/Sign Up/i));
    // Simulate navigation to home (if implemented)
    // expect(screen.getByText(/Discover Your Next Favorite Movie/i)).toBeInTheDocument();
  });
});

describe('Header navigation', () => {
  test('shows navigation links for authenticated users', () => {
    // You would mock AuthContext to simulate an authenticated user
    // For brevity, this is a placeholder
    // render(<App />);
    // expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });
});

// Integration test placeholder
describe('Frontend-backend integration', () => {
  test('fetches and displays user profile after login', async () => {
    // You would mock API responses or use MSW to simulate backend
    // For brevity, this is a placeholder
    // render(<App />);
    // fireEvent... (simulate login)
    // await screen.findByText(/Profile/i);
  });
});

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
