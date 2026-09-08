import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Leaderboard from '../components/layout/Leaderboard';

jest.mock('../components/store/slices/rankingSlice', () => ({
  fetchLeaderboard: () => ({ type: 'ranking/fetchLeaderboard/mock' }),
}));

function makeStore(ranking) {
  return configureStore({
    reducer: { ranking: (state = ranking) => state },
  });
}

describe('Leaderboard', () => {
  test('shows loading message when loading', () => {
    const store = makeStore({ leaderboard: [], loading: true });
    render(<Provider store={store}><Leaderboard /></Provider>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders table headers', () => {
    const store = makeStore({ leaderboard: [], loading: false });
    render(<Provider store={store}><Leaderboard /></Provider>);
    ['Rank', 'Username', 'Score', 'Solved'].forEach(h => {
      expect(screen.getByText(h)).toBeInTheDocument();
    });
  });

  test('renders leaderboard rows', () => {
    const leaderboard = [{ userId: 1, username: 'alice', totalScore: 200, problemsSolved: 10 }];
    const store = makeStore({ leaderboard, loading: false });
    render(<Provider store={store}><Leaderboard /></Provider>);
    expect(screen.getByText('alice')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('renders heading', () => {
    const store = makeStore({ leaderboard: [], loading: false });
    render(<Provider store={store}><Leaderboard /></Provider>);
    expect(screen.getByText('Global Leaderboard')).toBeInTheDocument();
  });
});
