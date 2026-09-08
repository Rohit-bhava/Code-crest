import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ChallengeList from '../components/Challenges/chanllengeList';

jest.mock('../components/store/slices/challengeSlice', () => ({
  fetchChallenges: () => ({ type: 'challenges/fetchAll/mock' }),
  removeChallenge: (id) => ({ type: 'challenges/remove/mock', payload: id }),
}));

function makeStore(challenges) {
  return configureStore({
    reducer: { challenges: (state = challenges) => state },
  });
}

describe('ChallengeList', () => {
  test('shows loading message when loading', () => {
    const store = makeStore({ list: [], loading: true });
    render(<Provider store={store}><ChallengeList onAdd={() => {}} /></Provider>);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('shows EmptyState when no challenges', () => {
    const store = makeStore({ list: [], loading: false });
    render(<Provider store={store}><ChallengeList onAdd={() => {}} /></Provider>);
    expect(screen.getByText('No challenges found.')).toBeInTheDocument();
  });

  test('renders challenge rows', () => {
    const list = [{ id: 1, title: 'Two Sum', difficulty: 'EASY', domain: 'Arrays' }];
    const store = makeStore({ list, loading: false });
    render(<Provider store={store}><ChallengeList onAdd={() => {}} /></Provider>);
    expect(screen.getByText('Two Sum')).toBeInTheDocument();
    expect(screen.getByText('EASY')).toBeInTheDocument();
    expect(screen.getByText('Arrays')).toBeInTheDocument();
  });

  test('renders Add Challenge button', () => {
    const store = makeStore({ list: [], loading: false });
    render(<Provider store={store}><ChallengeList onAdd={() => {}} /></Provider>);
    expect(screen.getByText('+ Add Challenge')).toBeInTheDocument();
  });

  test('renders table headers', () => {
    const list = [{ id: 1, title: 'Test', difficulty: 'HARD', domain: 'DP' }];
    const store = makeStore({ list, loading: false });
    render(<Provider store={store}><ChallengeList onAdd={() => {}} /></Provider>);
    ['Title', 'Difficulty', 'Domain', 'Action'].forEach(h => {
      expect(screen.getByText(h)).toBeInTheDocument();
    });
  });
});
