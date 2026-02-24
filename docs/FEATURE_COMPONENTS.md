# Feature Components

New feature components live in `src/features/` in their own folders, with unit tests and E2E coverage.

## Structure (per feature)

```
src/features/<FeatureName>/
  <FeatureName>.tsx       # Main component
  <FeatureName>.module.css
  <FeatureName>.test.tsx   # Unit tests
  [<FeatureName>Slice.ts] # Optional Redux slice
```

## Implemented features

### Notes (`features/Notes/`)

- **What**: Add and remove text notes in a list.
- **Redux**: `NotesSlice` (items array, addNote, removeNote), lazy-loaded as `NotesReducer`.
- **Unit tests**: `Notes.test.tsx` (render, add note, remove note).
- **E2E**: `tests/notes.spec.ts` (open Notes window, add note).

### Timer (`features/Timer/`)

- **What**: Simple stopwatch (Start, Pause, Reset).
- **Redux**: None (local state only).
- **Unit tests**: `Timer.test.tsx` (render, start/increment, reset).
- **E2E**: `tests/timer.spec.ts` (open Timer window, see controls).

## Adding a new feature

1. Create `src/features/<Name>/` with component and `*.test.tsx`.
2. Register in `src/utils/componentLoader.ts`.
3. Add header button and strings in `src/constants.ts` and `src/app/Header.tsx`.
4. Add E2E spec in `tests/<name>.spec.ts`.

## Running tests

- **Unit**: `npm test -- --watchAll=false`
- **E2E**: Start app (`npm start`), then `npx playwright test`
