import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ChallengeList from '../components/Challenges/ChallengeList';
import ChallengeForm from '../components/Challenges/ChallengeForm';
import Pagination from '../components/common/Pagination';
import authReducer from '../store/slices/authSlice';
import challengeReducer from '../store/slices/challengeSlice';

const makeStore = () =>
  configureStore({
    reducer: { auth: authReducer, challenges: challengeReducer },
    preloadedState: {
      auth: { user: { role: 'PLATFORM_ADMIN' }, token: 'tok', isAuthenticated: true, loading: false, error: null },
      challenges: { list: [], selected: null, submissionResult: null, loading: false, error: null },
    },
  });

const wrap = (ui, store) =>
  render(<Provider store={store}><MemoryRouter>{ui}</MemoryRouter></Provider>);

const sampleChallenges = [
  { id: 1, title: 'Two Sum', difficulty: 'EASY', basePoints: 100, timeLimitMs: 1000 },
  { id: 2, title: 'Binary Search', difficulty: 'MEDIUM', basePoints: 200, timeLimitMs: 2000 },
  { id: 3, title: 'Graph Traversal', difficulty: 'HARD', basePoints: 300, timeLimitMs: 3000 },
];

test('T07 - CRUD: ChallengeList dynamic row rendering', () => {
  const store = makeStore();
  wrap(<ChallengeList challenges={sampleChallenges} loading={false} />, store);
  expect(screen.getByText('Two Sum')).toBeInTheDocument();
  expect(screen.getByText('Binary Search')).toBeInTheDocument();
  expect(screen.getByText('Graph Traversal')).toBeInTheDocument();
  expect(screen.getAllByRole('row').length).toBe(4);
});

test('T09 - CRUD: ChallengeForm field population and button action', () => {
  const onSubmit = jest.fn();
  const initial = { title: 'Test Challenge', description: 'A description', difficulty: 'MEDIUM', basePoints: 150, timeLimitMs: 2000 };
  render(<ChallengeForm initial={initial} onSubmit={onSubmit} loading={false} submitLabel="Save Challenge" />);
  expect(screen.getByDisplayValue('Test Challenge')).toBeInTheDocument();
  expect(screen.getByDisplayValue('A description')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /save challenge/i })).toBeInTheDocument();
});

test('T17 - CRUD: ChallengeList edit accessibility', () => {
  const store = makeStore();
  wrap(<ChallengeList challenges={sampleChallenges} loading={false} />, store);
  const editButtons = screen.getAllByRole('button', { name: /edit/i });
  expect(editButtons.length).toBeGreaterThan(0);
});

test('T20 - UI: Pagination control availability', () => {
  const onPageChange = jest.fn();
  render(<Pagination currentPage={0} totalPages={3} onPageChange={onPageChange} />);
  expect(screen.getByText(/previous/i)).toBeInTheDocument();
  expect(screen.getByText(/next/i)).toBeInTheDocument();
});

test('T23 - Validation: ChallengeForm HTML5 required fields', () => {
  const onSubmit = jest.fn();
  render(<ChallengeForm onSubmit={onSubmit} loading={false} />);
  fireEvent.click(screen.getByRole('button', { name: /save challenge/i }));
  expect(onSubmit).not.toHaveBeenCalled();
  expect(screen.getByText(/title is required/i)).toBeInTheDocument();
});
