# Field Errors

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Field Errors Are Needed](#why-field-errors-are-needed)
- [Backend Validation Errors](#backend-validation-errors)
- [parseBackendErrors](#parsebackenderrors)
- [Field Error State](#field-error-state)
- [getFieldError](#getfielderror)
- [Field Error Rendering](#field-error-rendering)
- [Error Clearing](#error-clearing)
- [Field Error Workflow](#field-error-workflow)

## Purpose

Field errors display backend validation problems for individual form fields.

The dynamic form system separates:

```text
Field-level validation errors
General form errors
```

so users can clearly see which field caused the validation failure.

## Why Field Errors Are Needed

Backend validation errors are typically returned using field names.

Example:

```json
{
  "title": [
    "This field may not be blank."
  ]
}
```

The frontend must:

```text
Store field-specific errors
Match errors to fields
Render errors beside the correct field
Clear errors when fields change
```

The field error workflow standardises this behaviour across all dynamic forms.

## Backend Validation Errors

Validation errors are returned from failed API requests.

Example:

```js
catch (error) {
  const parsedErrors =
    parseBackendErrors(error);

  setFieldErrors(
    parsedErrors.fieldErrors
  );
}
```

The backend remains the source of truth for validation.

The frontend only displays the returned validation messages.

## parseBackendErrors

The current system uses:

```js
parseBackendErrors()
```

to separate:

```text
fieldErrors
generalError
```

This keeps backend error parsing separate from form rendering logic.

Example result:

```js
{
  fieldErrors: {
    title: [
      "This field may not be blank."
    ]
  },
  generalError:
    "Unable to save item."
}
```

## Field Error State

Field-level errors are stored in:

```js
const [fieldErrors, setFieldErrors] =
  useState({});
```

The error object uses backend field names as keys.

Example:

```js
{
  title: [
    "This field may not be blank."
  ]
}
```

This allows errors to map directly to configured fields.

## getFieldError

`FormFieldRenderer` extracts the correct error for the current field using:

```js
getFieldError(fieldErrors, field.name)
```

Example:

```js
const fieldError = getFieldError(
  fieldErrors,
  field.name
);
```

This keeps field error lookup logic reusable and consistent.

## Field Error Rendering

Field components receive the extracted error through props.

Example:

```jsx
<FormFieldText
  field={field}
  value={formData[field.name]}
  error={fieldError}
  onChange={onChange}
/>
```

The field component passes the error into:

```text
FormFieldWrapper
    ↓
FormFieldError
```

`FormFieldError` only renders when an error exists.

```jsx
if (!children) return null;
```

This keeps field layouts clean when no validation error is present.

## Error Clearing

When a field value changes, the field-specific error is cleared.

```js
setFieldErrors((prev) => ({
  ...prev,
  [name]: null,
}));
```

This prevents old validation messages from remaining visible after the user edits the field.

Only the changed field's error is cleared.

Other field errors remain untouched.

## Field Error Workflow

```text
Backend validation fails
        ↓
API request throws error
        ↓
parseBackendErrors executes
        ↓
fieldErrors stored in form state
        ↓
FormFieldRenderer extracts field error
        ↓
Field component receives error prop
        ↓
FormFieldWrapper renders FormFieldError
        ↓
User edits field
        ↓
handleChange clears that field error
```

The field error system keeps backend validation handling reusable, predictable, and consistent across all dynamic forms.