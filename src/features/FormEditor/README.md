# FormEditor Feature

A dynamic form component demonstrating React Hook Form integration with schema-driven validation.

## Structure

```
FormEditor/
├── FormEditor.tsx          # Main component with RHF integration
├── FormEditor.module.css   # Styles including error states
├── FormEditor.test.tsx     # Integration tests (10 tests)
├── README.md               # This file
└── FormFields/             # Reusable field components
    ├── FieldError.tsx      # Shared error display component
    ├── TextField.tsx       # Text input with forwardRef
    ├── TextField.test.tsx  # 6 tests
    ├── NumberField.tsx     # Number input with forwardRef
    ├── NumberField.test.tsx # 6 tests
    ├── CheckboxField.tsx   # Checkbox with forwardRef
    ├── CheckboxField.test.tsx # 6 tests
    ├── SelectField.tsx     # Select dropdown with forwardRef
    ├── SelectField.test.tsx # 8 tests
    └── index.ts            # Barrel export
```

## Key Features

- **Schema-driven validation** - Validation rules defined in `mockApi.ts`
- **React Hook Form** - Optimized re-renders and built-in validation
- **Lazy-loaded** - RHF library only loads when feature is used (~8.84KB chunk)
- **Shared error component** - `FieldError.tsx` used by all field components
- **forwardRef support** - All field components support refs for programmatic control
- **Auto-focus errors** - First error field receives focus after validation fails
- **Accessibility** - `aria-invalid`, `role="alert"`, proper label associations
- **Mock API** - Works without backend, easy to replace with real API

## Usage Example

The feature is loaded via the component loader when user clicks "Add Form Editor":

```typescript
// src/utils/componentLoader.ts
case COMPONENT_NAMES.FORM_EDITOR:
  return lazy(() => import('../features/FormEditor/FormEditor'));
```

## Testing

**Unit Tests**: 36 tests across 5 test files
- Field components: 24 tests
- FormEditor integration: 10 tests
- Mock API integration: ✓
- Validation display: ✓
- Form lifecycle: ✓

**E2E Tests**: 18 tests across 2 test files
- `tests/form-editor.spec.ts` - 6 tests (form loading, data population, editing)
- `tests/form-validation.spec.ts` - 12 tests (validation behavior, error display, auto-focus)

Run tests:
```bash
npm test -- --testPathPattern=FormEditor
npx playwright test form-editor
npx playwright test form-validation
```

## Validation Rules

Defined in `src/utils/mockApi.ts`:

- **firstName/lastName**: Required, 2-50 characters
- **age**: Required, 18-120 years
- **role**: Required, must select from options
- **isActive**: No validation (optional checkbox)

## Customization

### Replace Mock API
Replace the mock functions in `src/utils/mockApi.ts` with real API calls:

```typescript
export const fetchUsers = async (): Promise<UserData[]> => {
  const response = await fetch('/api/users');
  return response.json();
};
```

### Add New Field Type
1. Create new field component in `FormFields/` (use `FieldError` for error display)
2. Add to `FormFields/index.ts`
3. Add case in `FormEditor.tsx` `renderFormField()`
4. Update `FORM_TYPES` in `src/constants.ts`

Example:
```typescript
import FieldError from './FieldError';

const MyField = forwardRef<HTMLInputElement, MyFieldProps>(
  ({ name, label, register, errors }, ref) => {
    const { ref: registerRef, ...registerRest } = register(name);
    
    return (
      <div className={styles.formItem}>
        <label htmlFor={name}>{label}</label>
        <input {...registerRest} ref={/* merge refs */} />
        <FieldError error={errors?.[name]} />
      </div>
    );
  }
);
```

### Modify Validation
Update the `validation` property in `MOCK_SCHEMA` in `src/utils/mockApi.ts`:

```typescript
firstName: {
  formType: 'text',
  validation: {
    required: 'First name is required',
    minLength: { value: 2, message: 'Too short' },
    pattern: { value: /^[A-Za-z]+$/, message: 'Letters only' },
  },
}
```

## Related Documentation

- [REFACTOR.md](./REFACTOR.md) - Implementation details and refactoring guide
- [FIELD_REFS.md](./FIELD_REFS.md) - forwardRef usage examples
- [UNIT_TESTS.md](./UNIT_TESTS.md) - Unit test documentation
- [VALIDATION_TESTS.md](./VALIDATION_TESTS.md) - E2E validation test documentation
- [Mock API Guide](../../docs/MOCK_API.md) - API integration guide
