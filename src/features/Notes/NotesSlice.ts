import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotesState {
  items: string[];
}

const initialState: NotesState = {
  items: [],
};

const notesSlice = createSlice({
  name: 'Notes',
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<string>) => {
      if (action.payload.trim()) {
        state.items.push(action.payload.trim());
      }
    },
    removeNote: (state, action: PayloadAction<number>) => {
      state.items.splice(action.payload, 1);
    },
  },
});

export const { addNote, removeNote } = notesSlice.actions;
export default notesSlice.reducer;
