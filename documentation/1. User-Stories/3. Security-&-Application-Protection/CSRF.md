# CSRF Configuration

## Navigation

[← Back to README.md](/README.md)

[← Back to BACKEND.md](/docs/documentation/backend/BACKEND.md)

## Table of Contents

- [Purpose](#purpose)
- [Current Configuration](#current-configuration)
- [Trusted Frontend Origin](#trusted-frontend-origin)
- [Why CSRF Matters](#why-csrf-matters)
- [Relationship With Cookie Authentication](#relationship-with-cookie-authentication)
- [Frontend Integration](#frontend-integration)
- [Development Notes](#development-notes)
- [Key Principle](#key-principle)

## Purpose

This document explains the CSRF configuration used by the backend.

CSRF protection is important because the platform uses cookie-based authentication.

The backend must trust the frontend origin so authenticated requests from the frontend can be accepted correctly.

## Current Configuration

The backend currently defines trusted CSRF origins in `settings.py`.

```py
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
]
```

## Trusted Frontend Origin

The current trusted origin is:

```text
http://localhost:5173
```

This is the frontend development server.

It allows the React frontend to make trusted requests to the Django backend during development.

## Why CSRF Matters

CSRF protection helps prevent unwanted requests being submitted on behalf of an authenticated user.

Because authentication uses cookies, browsers may automatically include authentication cookies with requests.

CSRF protection helps ensure that authenticated requests come from a trusted source.

## Relationship With Cookie Authentication

The backend uses JWT cookies for authentication.

Relevant cookies include:

```text
access
refresh
```

Because cookies are automatically sent by the browser, CSRF configuration is important for protecting authenticated write requests.

## Frontend Integration

The frontend must send requests from an allowed and trusted origin.

During development, this means requests should come from:

```text
http://localhost:5173
```

If the frontend origin changes, the new origin must be added to:

```py
CSRF_TRUSTED_ORIGINS
```

## Development Notes

The current configuration is development-focused.

For production, this should be updated to include the deployed frontend domain instead of only localhost.

Example:

```py
CSRF_TRUSTED_ORIGINS = [
    "https://your-frontend-domain.com",
]
```
