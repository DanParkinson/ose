# Authentication

## Navigation

[← Back to README.md](/README.md)

[← Back to BACKEND.md](/docs/documentation/backend/BACKEND.md)

## Table of Contents

- [Purpose](#purpose)
- [Authentication Stack](#authentication-stack)
- [Authentication Architecture](#authentication-architecture)
- [JWT Cookie Authentication](#jwt-cookie-authentication)
  - [REST Framework Authentication](#rest-framework-authentication)
  - [REST_AUTH Configuration](#rest_auth-configuration)
  - [SimpleJWT Configuration](#simplejwt-configuration)
  - [Access And Refresh Tokens](#access-and-refresh-tokens)
  - [Token Rotation And Blacklisting](#token-rotation-and-blacklisting)
- [Authentication Philosophy](#authentication-philosophy)
- [Key Principle](#key-principle)

## Purpose

This document explains the authentication architecture used throughout the platform.

The authentication system is built using:

```text
Django REST Framework
dj-rest-auth
django-allauth
SimpleJWT
JWT cookie authentication
```

The platform uses email-based authentication instead of username-based authentication.

## Authentication Stack

The backend authentication system uses the following applications:

```py
INSTALLED_APPS = [
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",

    "dj_rest_auth",
    "dj_rest_auth.registration",

    "allauth",
    "allauth.account",
    "allauth.socialaccount",
]
```

## Authentication Architecture

The authentication system is designed around:

```text
email authentication
JWT cookies
frontend-controlled authentication state
backend-managed token validation
```

The frontend communicates with the backend using authenticated API requests.

The backend validates authentication using JWT cookies automatically.

## JWT Cookie Authentication

### REST Framework Authentication

The backend configures DRF authentication using:

```py
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "dj_rest_auth.jwt_auth.JWTCookieAuthentication",
    ],
}
```

This enables JWT cookie authentication for authenticated API requests.

### REST_AUTH Configuration

The backend configures dj-rest-auth using:

```py
REST_AUTH = {
    "USE_JWT": True,
    "JWT_AUTH_COOKIE": "access",
    "JWT_AUTH_REFRESH_COOKIE": "refresh",
    "JWT_AUTH_HTTPONLY": True,
    "JWT_AUTH_SECURE": JWT_AUTH_SECURE,
    "JWT_AUTH_SAMESITE": "Lax",
    "JWT_AUTH_RETURN_EXPIRATION": True,
    "TOKEN_MODEL": None,
}
```

#### JWT_AUTH_SECURE

`JWT_AUTH_SECURE` controls whether authentication cookies are only sent over HTTPS.

In development, local requests use HTTP, so secure cookies must be disabled.

In production, requests should use HTTPS, so secure cookies should be enabled.

```py
JWT_AUTH_SECURE = not DEBUG
```

This means:

```text
DEBUG=True  -> JWT_AUTH_SECURE=False
DEBUG=False -> JWT_AUTH_SECURE=True
```

### SimpleJWT Configuration

The backend configures JWT behaviour using:

```py
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,
}
```

### Access And Refresh Tokens

The authentication system uses two JWT cookies.

| Cookie | Purpose |
|---|---|
| `access` | Short-lived authentication token |
| `refresh` | Long-lived refresh token |

The frontend does not directly manage token storage.

Cookies are automatically included in authenticated requests.

### Token Rotation And Blacklisting

```py
"ROTATE_REFRESH_TOKENS": True,
"BLACKLIST_AFTER_ROTATION": True,
```

When refresh tokens are used:

```text
a new refresh token is issued
the previous refresh token is invalidated
```

This improves authentication security.

## Authentication Philosophy

The authentication system is designed around:

```text
email-first authentication
JWT cookie security
minimal frontend token handling
simple registration workflows
DRF-compatible authentication
```

The goal is to keep authentication predictable while reducing unnecessary account complexity.

## Key Principle

```text
The frontend should not manually store or manage JWT tokens.

Authentication state is handled by the frontend, but token validation
and token security are handled by the backend.
```
