import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './app/App';
import { APP_TEST } from './constants';

test('renders desktop UI header and add window buttons', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: APP_TEST.HEADING_TITLE })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: APP_TEST.BUTTON_ADD_LAZY_1 })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: APP_TEST.BUTTON_ADD_LAZY_2 })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: APP_TEST.BUTTON_ADD_LAZY_3 })).toBeInTheDocument();
});
