# FormEditor Unit Tests

## Overview

The FormEditor feature has comprehensive unit test coverage across all components, ensuring proper integration with React Hook Form and validation logic.

## Test Files

### 1. TextField.test.tsx (6 tests)
**Location**: `src/features/FormEditor/FormFields/TextField.test.tsx`

Tests verify:
- Renders with label and input
- Correct input type (`type="text"`)
- Error message display when validation fails
- `aria-invalid` attribute set correctly
- No `aria-invalid` when no error
- Correct `id` matching label's `htmlFor`

### 2. NumberField.test.tsx (6 tests)
**Location**: `src/features/FormEditor/FormFields/NumberField.test.tsx`

Tests verify:
- Renders with label and input
- Correct input type (`type="number"`)
- Error message display when validation fails
- `aria-invalid` attribute set correctly
- No `aria-invalid` when no error
- Correct `id` matching label's `htmlFor`

### 3. CheckboxField.test.tsx (6 tests)
**Location**: `src/features/FormEditor/FormFields/CheckboxField.test.tsx`

Tests verify:
- Renders with label and checkbox
- Correct input type (`type="checkbox"`)
- Error message display when validation fails
- `aria-invalid` attribute set correctly
- No `aria-invalid` when no error
- Correct `id` attribute

### 4. SelectField.test.tsx (8 tests)
**Location**: `src/features/FormEditor/FormFields/SelectField.test.tsx`

Tests verify:
- Renders with label and select
- All options render including placeholder
- Placeholder option is disabled
- Error message display when validation fails
- `aria-invalid` attribute set correctly
- No `aria-invalid` when no error
- Correct `id` matching label's `htmlFor`
- Renders only placeholder when no options provided

### 5. FormEditor.test.tsx (10 tests)
**Location**: `src/features/FormEditor/FormEditor.test.tsx`

Tests verify:
- Shows loading state initially
- Fetches and displays form data
- Renders all form fields from schema
- Populates form with fetched user data
- Submits form with updated data
- Disables submit button while submitting
- Calls updateUser API on form submission
- Formats field labels correctly (camelCase → Title Case)
- Resets form after successful submission
- Renders submit button with correct text

## Test Strategy

### Field Component Tests
**Focus**: Rendering, accessibility, and error display

These tests use a simple `TestWrapper` that provides a minimal React Hook Form context. They verify that each field component:
- Integrates correctly with RHF's `register()` function
- Displays errors passed via the `errors` prop
- Sets accessibility attributes correctly
- Uses centralized test selectors

**What they DON'T test**: Actual validation logic (that's tested in FormEditor and E2E tests)

### FormEditor Integration Tests
**Focus**: Data flow, API integration, and form lifecycle

These tests mock the API layer and verify:
- Data fetching on mount
- Form population with API data
- Form submission with updated values
- Loading and submitting states
- Form reset after successful submission
- Label formatting logic

**What they DON'T test**: Individual field rendering (that's tested in field component tests)

### Separation of Concerns

```
Field Component Tests (24 tests)
├── Rendering ✓
├── Accessibility ✓
└── Error Display ✓

FormEditor Tests (10 tests)
├── API Integration ✓
├── Data Flow ✓
├── Form Lifecycle ✓
└── State Management ✓

E2E Validation Tests (12 tests)
├── End-to-End Validation ✓
├── User Interactions ✓
├── Auto-Focus Logic ✓
└── Success/Error Flows ✓
```

## Running the Tests

```bash
# Run all FormEditor unit tests
npm test -- --testPathPattern=FormEditor

# Run specific field component test
npm test TextField.test

# Run with coverage
npm test -- --testPathPattern=FormEditor --coverage

# Watch mode
npm test -- --testPathPattern=FormEditor --watch
```

## Test Coverage Summary

| Component | Tests | Coverage |
|-----------|-------|----------|
| TextField | 6 | 100% |
| NumberField | 6 | 100% |
| CheckboxField | 6 | 100% |
| SelectField | 8 | 100% |
| FormEditor | 10 | 95%* |

*FormEditor has one uncovered error path (API fetch failure) which is handled by ErrorBoundary in production.

## Key Testing Patterns

### 1. Centralized Test Selectors
All tests use `TEST_SELECTORS` and `getFormFieldTestId()` from `src/testSelectors.ts`:

```typescript
import { TEST_SELECTORS, getFormFieldTestId } from '../../../testSelectors';

const input = screen.getByTestId(getFormFieldTestId('firstName'));
```

### 2. Mock API Integration
FormEditor tests mock the API layer:

```typescript
jest.mock('../../utils/mockApi');

mockFetchUsers.mockResolvedValue([MOCK_USER]);
mockFetchFormSchema.mockResolvedValue(MOCK_SCHEMA);
```

### 3. Accessibility Testing
All field tests verify ARIA attributes:

```typescript
expect(input).toHaveAttribute('aria-invalid', 'true');
expect(screen.getByRole('alert')).toBeInTheDocument();
```

### 4. React Hook Form Integration
Tests verify RHF integration without testing the library itself:

```typescript
const { register } = useForm();
<TextField register={register} errors={errors} />
```

## What Makes These Tests "Smart"

### ✅ Test YOUR Code
- Your field component implementations
- Your FormEditor integration logic
- Your API mocking strategy
- Your error display patterns
- Your accessibility implementation

### ❌ Don't Test Libraries
- React Hook Form's internal validation
- React's rendering engine
- Browser form APIs

### ✅ Fast and Focused
- Each test file is independent
- Tests run in ~1 second
- Clear test names describe what's being verified
- Minimal setup/teardown

### ✅ Maintainable
- Centralized test selectors prevent string drift
- Mock data defined once and reused
- Test wrappers reduce boilerplate
- Clear separation between unit and E2E tests

## Related Documentation

- [VALIDATION_TESTS.md](./VALIDATION_TESTS.md) - E2E tests for validation behavior
- [REFACTOR.md](./REFACTOR.md) - Implementation details
- [FIELD_REFS.md](./FIELD_REFS.md) - forwardRef usage and examples
- [Best Practices](../../docs/BEST_PRACTICES.md) - Testing guidelines
