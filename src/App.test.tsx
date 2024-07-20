import React, { act } from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import App from './app/App';

test('renders learn react link', async () => {
  render(<App />);

  // Use waitFor to handle the asynchronous rendering of components
  await waitFor(() => {
    const linkElement = screen.getByText(/ComponentLazy/i);
    expect(linkElement).toBeInTheDocument();
  });
});
