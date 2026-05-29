# General Errors

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why General Errors Are Needed](#why-general-errors-are-needed)
- [General Error State](#general-error-state)
- [Backend Error Parsing](#backend-error-parsing)
- [General Error Rendering](#general-error-rendering)
- [Submission Relationship](#submission-relationship)
- [General Error Clearing](#general-error-clearing)
- [General Error Workflow](#general-error-workflow)

## Purpose

General errors display backend or submission problems that are not tied to a specific form field.

The dynamic form system separates:

```text
Field validation errors
General form errors
```

so the user can clearly distinguish between:

```text
field-specific validation problems
system-level or submission-level problems
```

## Why General Errors Are Needed

Not all backend errors belong to individual fields.

Examples:

```text
Permission denied
Protected resource restrictions
Authentication failures
Unexpected server errors
Generic submission failures
```

These errors need to be displayed separately from field-level validation.

## General Error State

General errors are stored in dedicated form state.

```js
const [generalError, setGeneralError] =
  useState("");
```

Unlike field errors, general errors are stored as a single message string.

## Backend Error Parsing

General errors are extracted through:

```js
parseBackendErrors()
```

Example:

```js
const parsedErrors =
  parseBackendErrors(error);

setGeneralError(
  parsedErrors.generalError
);
```

This keeps backend response parsing separate from form rendering logic.

The parser decides whether an error belongs to:

```text
fieldErrors
generalError
```

## General Error Rendering

General errors are rendered near the top of the form.

Example:

```jsx
<FormError>
  {generalError}
</FormError>
```

This allows submission-level problems to remain visible regardless of which fields are currently displayed.

General errors are rendered separately from `FormFieldError`.

## Submission Relationship

General errors are commonly triggered during:

```text
Create submission
Update submission
Delete submission
```

Examples:

```text
Protected object restrictions
Permission failures
Authentication failures
Unexpected API errors
```

The submission handlers store these errors after failed requests.

## General Error Clearing

General errors are cleared before each new submission attempt.

Example:

```js
setGeneralError("");
```

This ensures previous submission errors do not remain visible during later requests.

Unlike field errors, general errors are not automatically cleared during normal field changes.

## General Error Workflow

```text
Submission request fails
        ↓
API error returned
        ↓
parseBackendErrors executes
        ↓
generalError extracted
        ↓
generalError stored in form state
        ↓
FormError renders message
        ↓
User submits again
        ↓
generalError cleared before request
```

The general error system keeps submission-level failures separate from field validation workflows.