import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ContestList from '../components/contests/ContestList';
import ContestForm from '../components/contests/ContestForm';
import authReducer from '../store/slices/authSlice';
import contestReducer from '../store/slices/contestSlice';

const makeStore = () =>
  configureStore({
    reducer: { auth: authReducer, contests: contestReducer },
    preloadedState: {
      auth: { user: { role: 'PLATFORM_ADMIN' }, token: 'tok', isAuthenticated: true, loading: false, error: null },
      contests: { list: [], selected: null, loading: false, error: null },
    },
  });

const wrap = (ui, store) =>
  render(<Provider store={store}><MemoryRouter>{ui}</MemoryRouter></Provider>);

const sampleContests = [
  { id: 1, title: 'Spring Contest', status: 'UPCOMING', startTime: '2025-06-01T10:00', endTime: '2025-06-01T12:00', capacity: 100 },
  { id: 2, title: 'Summer Hackathon', status: 'ACTIVE', startTime: '2025-07-01T10:00', endTime: '2025-07-01T14:00', capacity: 50 },
];

test('T18 - CRUD: ContestList component initialization', () => {
  const store = makeStore();
  wrap(<ContestList contests={sampleContests} loading={false} />, store);
  expect(screen.getByText('Spring Contest')).toBeInTheDocument();
  expect(screen.getByText('Summer Hackathon')).toBeInTheDocument();
});

test('T24 - CRUD: ContestForm title population', () => {
  const onSubmit = jest.fn();
  const initial = { title: 'My Contest', startTime: '2025-06-01T10:00', endTime: '2025-06-01T12:00', capacity: 50, status: 'UPCOMING' };
  render(<ContestForm initial={initial} onSubmit={onSubmit} loading={false} submitLabel="Save Contest" />);
  expect(screen.getByDisplayValue('My Contest')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /save contest/i })).toBeInTheDocument();
});
