import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, test } from 'vitest';
import App from './App';

beforeEach(() => {
  localStorage.clear();
});

test('renders the immigration tracker with zero initial progress', () => {
  render(<App />);

  expect(
    screen.getByRole('heading', {
      name: /hungarian immigration document tracker/i,
    }),
  ).toBeInTheDocument();
  expect(screen.getByText('0%')).toBeInTheDocument();
  expect(screen.getByText('0 of 10 documents completed')).toBeInTheDocument();
});

test('updates and persists progress when a document is checked', async () => {
  const user = userEvent.setup();
  const { unmount } = render(<App />);

  await user.click(screen.getByRole('checkbox', { name: /valid passport/i }));

  expect(screen.getByText('10%')).toBeInTheDocument();
  expect(screen.getByText('1 of 10 documents completed')).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('hungaryDocuments'))[0].completed).toBe(
    true,
  );

  unmount();
  render(<App />);

  expect(screen.getByRole('checkbox', { name: /valid passport/i })).toBeChecked();
  expect(screen.getByText('10%')).toBeInTheDocument();
});
