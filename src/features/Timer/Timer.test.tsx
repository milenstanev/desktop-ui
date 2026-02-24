import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Timer from './Timer';

describe('Timer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders timer with 00:00 and controls', () => {
    render(<Timer windowId="w1" windowName="Timer" />);
    expect(screen.getByTestId('timer-feature')).toBeInTheDocument();
    expect(screen.getByRole('timer')).toHaveTextContent('00:00');
    expect(screen.getByRole('button', { name: /start timer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pause timer/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset timer/i })).toBeInTheDocument();
  });

  it('starts and increments when Start is clicked', () => {
    render(<Timer windowId="w1" windowName="Timer" />);
    act(() => {
      screen.getByRole('button', { name: /start timer/i }).click();
    });
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.getByRole('timer')).toHaveTextContent('00:05');
  });

  it('resets to 00:00 when Reset is clicked', () => {
    render(<Timer windowId="w1" windowName="Timer" />);
    act(() => {
      screen.getByRole('button', { name: /start timer/i }).click();
    });
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    act(() => {
      screen.getByRole('button', { name: /reset timer/i }).click();
    });
    expect(screen.getByRole('timer')).toHaveTextContent('00:00');
  });
});
