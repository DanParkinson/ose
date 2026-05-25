# Authentication Forms

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Supported Forms](#supported-forms)
- [Shared Form Architecture](#shared-form-architecture)
- [Form State Management](#form-state-management)
- [Authentication Actions](#authentication-actions)
- [Response Handling](#response-handling)
- [Loading State](#loading-state)
- [Validation Errors](#validation-errors)
- [Navigation Flow](#navigation-flow)
- [Reusable Form Components](#reusable-form-components)

## Purpose

The authentication system uses a shared form architecture for all authentication-related workflows.

Each form follows the same state management, submission, validation, and feedback patterns while interacting with authentication actions exposed through the Auth Context.

## Supported Forms

The authentication system currently includes:

```text
Login
Registration
Forgot Password
Reset Password
Account Reactivation Request
Account Reactivation Confirmation
Change Password
```

Although each form performs a different task, they all follow the same workflow and component structure.

## Shared Form Architecture

Authentication forms follow a common submission flow.

```text
User enters form data
    ↓
Local state updates
    ↓
Auth Context action executes
    ↓
API request sent
    ↓
Structured response returned
    ↓
Success or error state updated
    ↓
UI rerenders
```

This provides consistent behaviour across all authentication forms.

## Form State Management

Each form manages its own local state.

Typical state includes:

```js
value state
error state
loading state
```

Example:

```js
const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);
```

This keeps form behaviour isolated while allowing authentication logic to remain centralised.

## Authentication Actions

Forms do not communicate with API endpoints directly.

Instead, they call actions exposed by the Auth Context.

Examples include:

```text
login()
register()
logout()
changePassword()
```

This keeps API communication separate from form rendering logic.

## Response Handling

Authentication actions return a consistent response structure.

Success:

```js
{
  success: true,
  errors: null,
}
```

Failure:

```js
{
  success: false,
  errors: {...}
}
```

This allows every authentication form to process responses using the same logic.

## Loading State

Forms prevent duplicate submissions while requests are active.

Typical behaviour:

```js
if (loading) return;
```

Loading state is also used to:

```text
Disable submit buttons
Display loading indicators
Prevent duplicate requests
```

## Validation Errors

Validation errors are returned from the backend and stored locally within the form.

Examples include:

```text
Email validation
Password validation
Authentication failures
General form errors
```

Field-level errors are displayed beside the relevant inputs while non-field errors are displayed using shared feedback components.

## Navigation Flow

Successful authentication actions may trigger navigation changes.

Examples include:

```text
Login          → Home Page
Registration   → Success Screen
Password Reset → Login Page
Reactivation   → Login Page
```

Navigation decisions remain the responsibility of the individual form.

## Reusable Form Components

Authentication forms are built using the shared form component system.

Common components include:

```text
FormContainer
FormFieldText
FormFieldError
FormSubmitButton
FormError
FormLink
ButtonSpinner
```

These components provide consistent styling, validation display, loading behaviour, and navigation throughout the authentication system.