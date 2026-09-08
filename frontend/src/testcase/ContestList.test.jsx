import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ContestList from '../components/contests/ContestList';

function makeStore(contests) {
  return configureStore({
    reducer: { contests: (state = contests) => state },
  });
}

describe('ContestList', () => {
  test('shows loading message when loading', () => {
    const store = makeStore({ items: [], loading: true });
    render(<Provider store={store}><ContestList /></Provider>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('shows empty message when no contests', () => {
    const store = makeStore({ items: [], loading: false });
    render(<Provider store={store}><ContestList /></Provider>);
    expect(screen.getByText('No contests available.')).toBeInTheDocument();
  });

  test('renders contest cards', () => {
    const items = [
      { id: 1, name: 'Spring Contest', status: 'ACTIVE', startTime: null, endTime: null },
    ];
    const store = makeStore({ items, loading: false });
    render(<Provider store={store}><ContestList /></Provider>);
    expect(screen.getByText('Spring Contest')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });

  test('shows Create Contest button when onAdd provided', () => {
    const store = makeStore({ items: [], loading: false });
    render(<Provider store={store}><ContestList onAdd={() => {}} /></Provider>);
    expect(screen.getByText('+ Create Contest')).toBeInTheDocument();
  });

  test('renders heading', () => {
    const store = makeStore({ items: [], loading: false });
    render(<Provider store={store}><ContestList /></Provider>);
    expect(screen.getByText('Programming Contests')).toBeInTheDocument();
  });
});
