import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import useLazyLoadReducer from '../../hooks/useLazyLoadReducer';
import featureReducer, { addNote, removeNote } from './NotesSlice';
import styles from './Notes.module.css';

const EMPTY_ITEMS: string[] = [];

interface NotesProps {
  windowId: string;
  windowName: string;
  lazyLoadReducerName: string;
}

const Notes: React.FC<NotesProps> = ({ lazyLoadReducerName }) => {
  useLazyLoadReducer({ lazyLoadReducerName, featureReducer });
  const dispatch = useAppDispatch();
  const items = useAppSelector((state: RootState) =>
    (state[lazyLoadReducerName] as { items?: string[] } | undefined)?.items ?? EMPTY_ITEMS
  );
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addNote(input));
    setInput('');
  };

  return (
    <div className={styles.notes} data-testid="notes-feature">
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="New note..."
          aria-label="New note"
          className={styles.input}
        />
        <button type="submit" aria-label="Add note">
          Add
        </button>
      </form>
      <ul className={styles.list} aria-label="Notes list">
        {items.map((item, i) => (
          <li key={`${i}-${item}`} className={styles.item}>
            <span>{item}</span>
            <button
              type="button"
              onClick={() => dispatch(removeNote(i))}
              aria-label={`Remove note: ${item}`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;
