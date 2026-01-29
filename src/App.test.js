import { render, screen } from '@testing-library/react';
import App from './App';

test('renders immigration tracker header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Hungarian Immigration Document Tracker/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders progress section', () => {
  render(<App />);
  const progressText = screen.getByText(/documents completed/i);
  expect(progressText).toBeInTheDocument();
});

test('renders document categories', () => {
  render(<App />);
  expect(screen.getByText(/Essential Documents/i)).toBeInTheDocument();
  expect(screen.getByText(/Financial Documents/i)).toBeInTheDocument();
  expect(screen.getByText(/Employment Documents/i)).toBeInTheDocument();
  expect(screen.getByText(/Personal Documents/i)).toBeInTheDocument();
});

test('renders reset button', () => {
  render(<App />);
  const resetButton = screen.getByRole('button', { name: /reset progress/i });
  expect(resetButton).toBeInTheDocument();
});
