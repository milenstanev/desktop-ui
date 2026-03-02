# Code Formatting Guide

This document defines the consistent formatting standards for the Desktop UI codebase.

## Core Principles

### 1. Blank Line After Variable Declarations
Always add a blank line after variable declarations before the next logical block.

```typescript
// ✅ GOOD
const result = next(action);

if (condition) {
  // code
}

// ❌ BAD
const result = next(action);
if (condition) {
  // code
}
```

### 2. Blank Line Before Control Structures
Add a blank line before `if`, `for`, `while`, `try`, `switch` statements.

```typescript
// ✅ GOOD
const data = getData();

if (data) {
  process(data);
}

// ❌ BAD
const data = getData();
if (data) {
  process(data);
}
```

### 3. Blank Line After Closing Braces
Add a blank line after closing braces of blocks (except when followed by `else`, `catch`, `finally`).

```typescript
// ✅ GOOD
if (condition) {
  doSomething();
}

doSomethingElse();

// ❌ BAD
if (condition) {
  doSomething();
}
doSomethingElse();
```

### 4. Blank Line Before Return Statements
Always add a blank line before `return` statements.

```typescript
// ✅ GOOD
const value = calculate();

return value;

// ❌ BAD
const value = calculate();
return value;
```

### 5. Blank Line in useCallback/useMemo
Add a blank line after variable declarations inside callbacks.

```typescript
// ✅ GOOD
const handleClick = useCallback(() => {
  const id = uuidv4();

  dispatch(action(id));
}, [dispatch]);

// ❌ BAD
const handleClick = useCallback(() => {
  const id = uuidv4();
  dispatch(action(id));
}, [dispatch]);
```

### 6. Blank Line Between Logical Sections
Separate different logical sections with blank lines.

```typescript
// ✅ GOOD
const state = store.getState();
const { data } = state.slice;

try {
  localStorage.setItem(key, JSON.stringify(data));
} catch {
  console.warn(error);
}

return result;

// ❌ BAD
const state = store.getState();
const { data } = state.slice;
try {
  localStorage.setItem(key, JSON.stringify(data));
} catch {
  console.warn(error);
}
return result;
```

## Examples from Codebase

### Middleware Pattern (Reference)
```typescript
const result = next(action);

if (
  removeWindow.match(action) ||
  addWindow.match(action) ||
  updateLayouts.match(action)
) {
  const state = store.getState();
  const { desktopWindows, layouts } = state.Desktop;

  try {
    localStorage.setItem(KEY, JSON.stringify(desktopWindows));
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(layouts));
  } catch {
    console.warn(ERROR_MESSAGE);
  }
}

return result;
```

### useCallback Pattern
```typescript
const handleAction = useCallback(() => {
  const id = uuidv4();

  dispatch(
    addWindow({
      id,
      name: COMPONENT_NAMES.COUNTER,
      lazyLoadComponent: 'Counter',
      layout: undefined,
    })
  );
}, [dispatch]);
```

### Reducer Pattern
```typescript
addWindow: (state, action: PayloadAction<DesktopUIWindow>) => {
  if (!state.desktopWindows.find((window) => window.id === action.payload.id)) {
    state.desktopWindows.unshift(action.payload);
    state.focusedWindowId = action.payload.id;

    const windowCount = state.layouts.lg.length;
    const lgCol = (windowCount % 3) * 4;
    const lgRow = Math.floor(windowCount / 3) * 4;

    const lg: Layout = action.payload.layout?.lg ?? {
      ...defaultWindowsPositions.lg,
      i: `${action.payload.id}`,
      x: lgCol,
      y: lgRow,
    };

    state.layouts.lg.push(lg);
    state.layouts.md.push(md);
    state.layouts.sm.push(sm);
  }
},
```

## Enforcement

- Run `npm run format` before committing
- Pre-commit hooks will enforce these rules
- ESLint and Prettier are configured to match these standards

## Benefits

1. **Readability**: Clear visual separation of logical blocks
2. **Consistency**: Same pattern throughout codebase
3. **Maintainability**: Easier to scan and understand code
4. **Diff Quality**: Better git diffs with logical grouping
