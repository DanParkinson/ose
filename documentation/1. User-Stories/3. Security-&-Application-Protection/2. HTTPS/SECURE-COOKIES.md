# Secure Cookies

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Secure Authentication Cookies](#secure-authentication-cookies)
- [Secure Session Cookies](#secure-session-cookies)
- [Secure CSRF Cookies](#secure-csrf-cookies)
- [SameSite Cookie Policy](#samesite-cookie-policy)
- [Development Configuration](#development-configuration)
- [Production Configuration](#production-configuration)
- [Relationship With HTTPS](#relationship-with-https)

## Purpose

The platform uses secure cookie configuration to protect authentication tokens, session data, and CSRF tokens during transmission between the browser and backend.

These settings help prevent sensitive cookies from being transmitted over insecure connections.

## Secure Authentication Cookies

JWT authentication cookies are configured using:

```py
JWT_AUTH_SECURE = not DEBUG
```

and applied through:

```py
REST_AUTH = {
    "JWT_AUTH_SECURE": JWT_AUTH_SECURE,
}
```

When enabled, authentication cookies are only transmitted over HTTPS connections.

This applies to:

```text
access
refresh
```

authentication cookies.

## Secure Session Cookies

Session cookies are configured using:

```py
SESSION_COOKIE_SECURE = not DEBUG
```

When enabled, Django session cookies are only sent over HTTPS connections.

This helps prevent session information from being exposed over insecure HTTP traffic.

## Secure CSRF Cookies

CSRF protection cookies are configured using:

```py
CSRF_COOKIE_SECURE = not DEBUG
```

When enabled, CSRF cookies can only be transmitted over HTTPS.

This provides additional protection for authenticated requests that rely on CSRF validation.

## SameSite Cookie Policy

The platform configures cookie behaviour using:

```py
JWT_AUTH_SAMESITE = "Lax" if DEBUG else "None"
```

This value is applied through:

```py
REST_AUTH = {
    "JWT_AUTH_SAMESITE": JWT_AUTH_SAMESITE,
}
```

The SameSite policy controls when browsers are permitted to send authentication cookies.

## Development Configuration

Local development commonly uses separate frontend and backend servers running over HTTP.

Example:

```text
Frontend:
http://localhost:5173

Backend:
http://localhost:8000
```

Development uses:

```text
Secure = False
SameSite = Lax
```

This allows authentication cookies to function correctly without requiring HTTPS certificates during local development.

## Production Configuration

Production deployments use separate frontend and backend domains communicating over HTTPS.

Example:

```text
Frontend:
https://open-source-education.co.uk

Backend:
https://api.open-source-education.co.uk
```

Production uses:

```text
Secure = True
SameSite = None
```

This configuration allows authentication cookies to be transmitted between frontend and backend domains while maintaining browser security requirements.

Browsers require cookies configured with:

```text
SameSite=None
```

to also have:

```text
Secure=True
```

otherwise the cookies will be rejected.

## Relationship With HTTPS

Secure cookie settings depend on HTTPS being enabled.

The platform enforces HTTPS in production using:

```py
SECURE_SSL_REDIRECT = not DEBUG
```

Without HTTPS:

```text
Secure authentication cookies cannot be sent
Secure session cookies cannot be sent
Secure CSRF cookies cannot be sent
```

Secure cookies and HTTPS therefore work together to protect authenticated sessions and sensitive application data.