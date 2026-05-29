# Error Handling

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Interceptor Error Handling](#interceptor-error-handling)
- [Refresh Failure](#refresh-failure)
- [Rejected Errors](#rejected-errors)
- [Form Error Handling](#form-error-handling)
- [Component Responsibility](#component-responsibility)

## Purpose

Error handling defines how failed API requests are passed through the frontend request system.

The Axios response interceptor handles authentication recovery attempts, but it does not display errors directly.

UI components and forms remain responsible for showing errors to the user.

## Interceptor Error Handling

When an API request fails, the response interceptor checks whether the error is a `401 Unauthorized` response.

```js
error.response?.status === 401
```

If the request meets the retry conditions, the interceptor attempts token refresh.

If the error does not meet those conditions, it is rejected normally.

```js
return Promise.reject(error);
```

## Refresh Failure

If token refresh fails, the refresh error is rejected.

```js
catch (refreshError) {
    return Promise.reject(refreshError);
}
```

This prevents the frontend from pretending the original request succeeded when the authentication recovery attempt failed.

## Rejected Errors

Rejected errors are returned to the code that made the original request.

This allows calling functions to decide how the error should be handled.

Examples:

```text
Forms can display validation errors
Hooks can store request errors
Pages can show fallback UI
Components can display error messages
```

## Form Error Handling

Authentication forms and API forms handle errors locally.

A common pattern is:

```js
catch (error) {
    const data = error.response?.data;

    return {
        success: false,
        errors: data || {
            non_field_errors: [
                "Request failed.",
            ],
        },
    };
}
```

This gives forms a consistent error object to render.

## Component Responsibility

The request layer should not decide how errors appear in the interface.

Responsibilities are separated as follows:

```text
Axios interceptor
    → Detects request failure
    → Attempts token refresh where appropriate
    → Rejects unresolved errors

API utilities/hooks
    → Catch or expose request errors
    → Store loading/error state where needed

Forms/components
    → Display field errors
    → Display general errors
    → Show fallback messages
```

This keeps error handling flexible while avoiding duplicated request recovery logic.