import React from 'react';
import { render, screen } from '@testing-library/react';
import EmptyState from '../components/Challenges/common/EmptyState';

describe('EmptyState', () => {
  test('renders default message', () => {
    render(<EmptyState />);
    expect(screen.getByText('No data found.')).toBeInTheDocument();
  });

  test('renders custom message', () => {
    render(<EmptyState message="No challenges found." />);
    expect(screen.getByText('No challenges found.')).toBeInTheDocument();
  });
});
