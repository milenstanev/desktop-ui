import React from 'react';
import { render, screen } from '@testing-library/react';
import Window from './Window';

const noop = () => {};

describe('Window', () => {
  it('renders name and children', () => {
    render(
      <Window id="w1" name="My Window" removeWindow={noop}>
        <span>Content</span>
      </Window>
    );
    expect(screen.getByText('My Window')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies focused class when isFocused', () => {
    render(
      <Window id="w1" name="W" removeWindow={noop} isFocused>
        <span>Content</span>
      </Window>
    );
    const windowEl = screen.getByRole('application', { name: /window/i });
    expect(windowEl.className).toMatch(/focused/);
  });

  it('does not apply focused class when not focused', () => {
    render(
      <Window id="w1" name="W" removeWindow={noop} isFocused={false}>
        <span>Content</span>
      </Window>
    );
    const windowEl = screen.getByRole('application', { name: /window/i });
    expect(windowEl.className).not.toMatch(/focused/);
  });

  it('calls removeWindow when Remove button is clicked', () => {
    const removeWindow = jest.fn();
    render(
      <Window id="w1" name="W" removeWindow={removeWindow} lazyLoadReducerName="Lazy2">
        <span>Content</span>
      </Window>
    );
    screen.getByLabelText('Close window').click();
    expect(removeWindow).toHaveBeenCalledWith('w1', 'Lazy2');
  });

  it('calls onFocus when clicking window content', () => {
    const onFocus = jest.fn();
    render(
      <Window id="w1" name="W" removeWindow={noop} onFocus={onFocus}>
        <span>Content text</span>
      </Window>
    );
    const content = screen.getByText('Content text');
    content.click();
    expect(onFocus).toHaveBeenCalled();
  });
});
