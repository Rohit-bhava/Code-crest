import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Navbar from '../components/layout/Navbar';
import authReducer, { logout } from '../components/store/slices/authSlice';

function renderNavbar(isAuthenticated = false) {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: { auth: { isAuthenticated, token: isAuthenticated ? 'token' : null, user: null, loading: false, error: null } },
  });
  return { store, ...render(<Provider store={store}><MemoryRouter><Navbar /></MemoryRouter></Provider>) };
}

describe('Navbar', () => {
  test('shows Login link when not authenticated', () => {
    renderNavbar(false);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  test('shows nav links when authenticated', () => {
    renderNavbar(true);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Challenges')).toBeInTheDocument();
    expect(screen.getByText('Contests')).toBeInTheDocument();
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('shows brand name CodeCrest', () => {
    renderNavbar(false);
    expect(screen.getByText('CodeCrest')).toBeInTheDocument();
  });

  test('logout button dispatches logout action', () => {
    const { store } = renderNavbar(true);
    fireEvent.click(screen.getByText('Logout'));
    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(store.getState().auth.token).toBeNull();
  });
});
