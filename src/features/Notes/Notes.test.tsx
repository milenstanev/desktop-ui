import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { setupStore } from '../../app/store';
import Notes from './Notes';

function renderNotes() {
  const store = setupStore();
  render(
    <Provider store={store}>
      <Notes
        windowId="w1"
        windowName="Notes"
        lazyLoadReducerName="NotesReducer"
      />
    </Provider>
  );
  return store;
}

describe('Notes', () => {
  it('renders notes feature with input and add button', () => {
    renderNotes();
    expect(screen.getByTestId('notes-feature')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('New note...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add note/i })).toBeInTheDocument();
  });

  it('adds a note when submitting the form', async () => {
    const store = renderNotes();
    await userEvent.type(screen.getByPlaceholderText('New note...'), 'My first note');
    await userEvent.click(screen.getByRole('button', { name: /add note/i }));
    expect(screen.getByText('My first note')).toBeInTheDocument();
    expect(store.getState().NotesReducer?.items).toEqual(['My first note']);
  });

  it('removes a note when clicking Remove', async () => {
    const store = renderNotes();
    await userEvent.type(screen.getByPlaceholderText('New note...'), 'To remove');
    await userEvent.click(screen.getByRole('button', { name: /add note/i }));
    await userEvent.click(screen.getByRole('button', { name: /remove note: to remove/i }));
    expect(screen.queryByText('To remove')).not.toBeInTheDocument();
    expect(store.getState().NotesReducer?.items).toEqual([]);
  });
});
