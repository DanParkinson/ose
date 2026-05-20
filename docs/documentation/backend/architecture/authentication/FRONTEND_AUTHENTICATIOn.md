# Frontend Authentication

## Navigation

[← Back to README.md](/README.md)

[← Back to BACKEND.md](/docs/documentation/backend/BACKEND.md)

## Table of Contents

- [Purpose](#purpose)
- [Frontend Integration](#frontend-integration)
- [CORS Configuration](#cors-configuration)
- [CSRF Trusted Origins](#csrf-trusted-origins)
- [Frontend Authentication Flow](#frontend-authentication-flow)
- [Frontend Authentication State](#frontend-authentication-state)
- [Key Principle](#key-principle)

## Purpose

This document explains how the frontend communicates with the backend authentication system.

The frontend authentication flow is built around:

```text
JWT cookies
credentialed API requests
backend-managed token validation
frontend-managed authentication state
```

The frontend does not manually store JWT tokens.

## Frontend Integration

The React frontend communicates with the Django backend through API requests.

Authenticated requests rely on cookies being included with each request.

This means frontend requests must be configured to send credentials.

## CORS Configuration

The backend allows frontend authentication requests using:

```py
CORS_ALLOWED_ORIGINS = os.environ.get(
    "CORS_ALLOWED_ORIGINS",
    ""
).split(",")

CORS_ALLOW_CREDENTIALS = True
```

`CORS_ALLOWED_ORIGINS` defines which frontend origins are allowed to make requests to the backend.

`CORS_ALLOW_CREDENTIALS` allows cookies to be included in cross-origin requests.

Development example:

```env
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

## CSRF Trusted Origins

The backend trusts the frontend origin using:

```py
CSRF_TRUSTED_ORIGINS = os.environ.get(
    "CSRF_TRUSTED_ORIGINS",
    ""
).split(",")
```

`CSRF_TRUSTED_ORIGINS` defines which frontend origins are trusted for CSRF-protected requests.

Development example:

```env
CSRF_TRUSTED_ORIGINS=http://localhost:5173
```

## Frontend Authentication Flow

High-level frontend authentication workflow:

```text
frontend sends login request with credentials enabled
    ↓
backend validates credentials
    ↓
JWT cookies are issued
    ↓
frontend stores authentication state
    ↓
frontend sends authenticated requests with credentials enabled
    ↓
backend validates JWT cookies
    ↓
authenticated API response returns
```

## Frontend Authentication State

Authenticated user data is returned through the custom user details serializer.

The frontend receives:

| Field | Purpose |
|---|---|
| `id` | User identifier |
| `email` | Authenticated user email |
| `is_staff` | Admin dashboard access |
| `is_superuser` | Superuser access checks |

This supports:

```text
authentication state management
admin-only UI rendering
permission-based frontend behaviour
```

Frontend state controls what the user can see in the interface.

Backend permissions still control what the user is allowed to do.

## Key Principle

```text
The frontend manages authentication state.

The backend manages authentication security.
```

The frontend should not manually store, decode, or manage JWT tokens.

JWT cookies are issued, refreshed, validated, and protected by the backend authentication system.
