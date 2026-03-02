# Form Field Refs - Advanced Usage

## Overview

All form field components (`TextField`, `NumberField`, `CheckboxField`, `SelectField`) support `forwardRef`, allowing programmatic control of form inputs.

## Why forwardRef?

`forwardRef` enables:
- ✅ Programmatic focus management
- ✅ Scroll to specific fields
- ✅ Custom validation triggers
- ✅ Integration with third-party libraries
- ✅ Imperative DOM operations when needed

## Implementation Pattern

All field components follow this pattern:

```typescript
import { forwardRef, memo } from 'react';
import { UseFormRegister } from 'react-hook-form';

const TextField = memo(
  forwardRef<HTMLInputElement, TextFieldProps>(
    ({ name, label, register, errors, validation }, ref) => {
      // Destructure React Hook Form's ref
      const { ref: registerRef, ...registerRest } = register(name, validation);

      return (
        <input
          {...registerRest}
          ref={(e) => {
            // Register with React Hook Form (required!)
            registerRef(e);
            
            // Also forward to external ref if provided
            if (typeof ref === 'function') {
              ref(e);
            } else if (ref) {
              ref.current = e;
            }
          }}
        />
      );
    }
  )
);
```

## Usage Examples

### Example 1: Focus First Field on Mount

```typescript
import { useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField } from './FormFields';

const MyForm = () => {
  const firstNameRef = useRef<HTMLInputElement>(null);
  const { register } = useForm();

  useEffect(() => {
    // Focus first field when form loads
    firstNameRef.current?.focus();
  }, []);

  return (
    <TextField
      name="firstName"
      label="First Name"
      register={register}
      ref={firstNameRef} // ← Pass ref
    />
  );
};
```

### Example 2: Auto-Focus First Error Field (Current Implementation)

```typescript
const FormEditor = () => {
  const { register, formState: { errors }, setFocus } = useForm<UserData>();

  // Automatically focus first field with error
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0] as keyof UserData;
      setFocus(firstErrorField); // ← React Hook Form's built-in setFocus
    }
  }, [errors, setFocus]);

  return (
    <form>
      <TextField name="firstName" label="First Name" register={register} />
      {/* More fields... */}
    </form>
  );
};
```

### Example 3: Scroll to Field on Error

```typescript
const MyForm = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const { register, formState: { errors } } = useForm();

  useEffect(() => {
    if (errors.email) {
      // Scroll to email field if it has an error
      emailRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      emailRef.current?.focus();
    }
  }, [errors.email]);

  return (
    <TextField
      name="email"
      label="Email"
      register={register}
      ref={emailRef}
    />
  );
};
```

### Example 4: Programmatic Value Access

```typescript
const MyForm = () => {
  const ageRef = useRef<HTMLInputElement>(null);
  const { register } = useForm();

  const checkAge = () => {
    const currentAge = ageRef.current?.value;
    console.log('Current age:', currentAge);
  };

  return (
    <>
      <NumberField
        name="age"
        label="Age"
        register={register}
        ref={ageRef}
      />
      <button type="button" onClick={checkAge}>
        Check Age
      </button>
    </>
  );
};
```

### Example 5: Multiple Refs with Array

```typescript
const MyForm = () => {
  const fieldRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { register } = useForm();

  const focusField = (index: number) => {
    fieldRefs.current[index]?.focus();
  };

  return (
    <>
      <TextField
        name="field1"
        label="Field 1"
        register={register}
        ref={(el) => (fieldRefs.current[0] = el)}
      />
      <TextField
        name="field2"
        label="Field 2"
        register={register}
        ref={(el) => (fieldRefs.current[1] = el)}
      />
      <button type="button" onClick={() => focusField(0)}>
        Focus Field 1
      </button>
    </>
  );
};
```

## Important Notes

### Combining React Hook Form Ref with forwardRef

The key challenge is that React Hook Form's `register()` function returns a `ref` that must be attached to the input. When using `forwardRef`, you need to merge both refs:

```typescript
const { ref: registerRef, ...registerRest } = register(name, validation);

<input
  {...registerRest}
  ref={(e) => {
    registerRef(e);      // ← Required for React Hook Form
    if (ref) {           // ← Optional external ref
      // Handle both function and object refs
    }
  }}
/>
```

### When to Use Refs

**Good use cases**:
- ✅ Auto-focus on mount or error
- ✅ Scroll to field
- ✅ Custom validation feedback
- ✅ Integration with non-React libraries

**Avoid**:
- ❌ Reading/writing values (use React Hook Form's `watch()` and `setValue()`)
- ❌ Triggering validation (use `trigger()`)
- ❌ Controlling form state (use React Hook Form's API)

### React Hook Form's Built-in Focus

React Hook Form has a built-in `setFocus()` method that's often better than using refs:

```typescript
const { setFocus } = useForm();

// Focus by field name (no ref needed!)
setFocus('firstName');
```

**Current implementation** uses `setFocus()` to auto-focus the first error field.

## Performance

- All field components are wrapped with `memo()` to prevent unnecessary re-renders
- `forwardRef` has minimal performance impact
- Refs don't cause re-renders

## Accessibility

When using refs for focus management:
- ✅ Ensure focus is visible (`:focus-visible` styles)
- ✅ Don't trap focus unexpectedly
- ✅ Respect user's focus preferences
- ✅ Use `aria-invalid` for error states (already implemented)

---

**Status**: ✅ Production-ready forwardRef implementation with examples
