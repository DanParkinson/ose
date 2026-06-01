# JWT Cookie Authentication

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Authentication Approach](#authentication-approach)
- [Access Cookie](#access-cookie)
- [Refresh Cookie](#refresh-cookie)
- [HTTP-Only Cookie Protection](#http-only-cookie-protection)
- [Environment-Based Cookie Security](#environment-based-cookie-security)
- [Token Lifetimes](#token-lifetimes)
- [Token Rotation](#token-rotation)
- [DRF Authentication Class](#drf-authentication-class)
- [Frontend Relationship](#frontend-relationship)

## Purpose

JWT cookie authentication is used to maintain authenticated sessions between the React frontend and Django REST Framework backend.

The platform stores JWT tokens in cookies instead of manually storing tokens in frontend state or browser storage.

## Authentication Approach

The backend uses DJ-Rest-Auth with JWT authentication enabled.

```py
"USE_JWT": True
```

Django REST Framework authenticates incoming requests using DJ-Rest-Auth's JWT cookie authentication class.

```py
"DEFAULT_AUTHENTICATION_CLASSES": [
    "dj_rest_auth.jwt_auth.JWTCookieAuthentication",
]
```

This allows protected API views to identify authenticated users from the JWT cookies included with each request.

## Access Cookie

The access token is stored in the `access` cookie.

```py
"JWT_AUTH_COOKIE": "access"
```

The access token is short-lived and is used to authenticate protected API requests.

## Refresh Cookie

The refresh token is stored in the `refresh` cookie.

```py
"JWT_AUTH_REFRESH_COOKIE": "refresh"
```

The refresh token is used to renew authentication when the access token expires.

## HTTP-Only Cookie Protection

Authentication cookies are configured as HTTP-only.

```py
"JWT_AUTH_HTTPONLY": True
```

This prevents JavaScript from directly reading the authentication cookies.

The frontend does not manually access, store, or decode JWT tokens.

## Environment-Based Cookie Security

Cookie security changes depending on whether the application is running in development or production.

```py
JWT_AUTH_SECURE = not DEBUG
JWT_AUTH_SAMESITE = "Lax" if DEBUG else "None"
```

Development:

```text
Secure = False
SameSite = Lax
```

Production:

```text
Secure = True
SameSite = None
```

This allows local development over HTTP while requiring secure HTTPS cookies in production.

## Token Lifetimes

JWT token lifetimes are configured through Simple JWT.

```py
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
}
```

The platform uses:

```text
Access token  → 15 minutes
Refresh token → 1 day
```

This keeps access tokens short-lived while allowing sessions to continue through refresh tokens.

## Token Rotation

Refresh token rotation is enabled.

```py
"ROTATE_REFRESH_TOKENS": True
"BLACKLIST_AFTER_ROTATION": True
```

When a refresh token is used, a new refresh token is issued and the old one is blacklisted.

This reduces the risk of old refresh tokens continuing to work after rotation.

## DRF Authentication Class

Django REST Framework is configured to use JWT cookie authentication globally.

```py
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "dj_rest_auth.jwt_auth.JWTCookieAuthentication",
    ],
}
```

This means protected API views can use normal DRF permission classes such as:

```text
IsAuthenticated
IsAdminUser
```

without manually handling JWT tokens inside each view.

## Frontend Relationship

The frontend must send credentials with API requests so cookies are included.

The frontend does not manually manage JWT tokens.

Instead, authentication depends on:

```text
Backend-issued JWT cookies
Axios credentials enabled
DRF JWT cookie authentication
Backend permission checks
```

The frontend uses authenticated user responses to update UI state, while the backend remains responsible for validating tokens and enforcing access control.