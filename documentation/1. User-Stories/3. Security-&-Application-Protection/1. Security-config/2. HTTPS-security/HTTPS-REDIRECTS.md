# HTTPS Redirects

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [HTTPS Enforcement](#https-enforcement)
- [Development Behaviour](#development-behaviour)
- [Production Behaviour](#production-behaviour)
- [Request Flow](#request-flow)
- [Relationship With Secure Cookies](#relationship-with-secure-cookies)

## Purpose

HTTPS redirects ensure that all application traffic uses encrypted HTTPS connections in production environments.

This helps protect authentication data, session information, and other sensitive request data while it is transmitted between the browser and server.

## HTTPS Enforcement

The platform automatically redirects HTTP traffic to HTTPS using:

```py
SECURE_SSL_REDIRECT = not DEBUG
```

This setting changes behaviour based on the current environment.

When running in development:

```py
DEBUG = True
```

HTTPS redirects are disabled.

When running in production:

```py
DEBUG = False
```

HTTPS redirects are automatically enabled.

## Development Behaviour

Local development commonly runs over HTTP.

Example:

```text
Frontend:
http://localhost:5173

Backend:
http://localhost:8000
```

Because local development typically does not use HTTPS certificates, redirects remain disabled.

```py
SECURE_SSL_REDIRECT = False
```

This allows normal local development workflows.

## Production Behaviour

Production deployments should always use HTTPS.

When production mode is enabled:

```py
SECURE_SSL_REDIRECT = True
```

Any incoming HTTP request is automatically redirected to the HTTPS version of the same URL.

Example:

```text
http://api.open-source-education.co.uk/api/auth/user/
                    ↓
https://api.open-source-education.co.uk/api/auth/user/
```

This ensures all communication occurs over encrypted connections.

## Request Flow

```text
User visits HTTP URL
    ↓
Django detects insecure request
    ↓
Automatic redirect issued
    ↓
Browser requests HTTPS version
    ↓
Secure connection established
```

This process happens automatically and is transparent to the user.

## Relationship With Secure Cookies

Several security settings rely on HTTPS being available.

Examples include:

```py
JWT_AUTH_SECURE = not DEBUG
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG
```

These settings instruct browsers to only send authentication and security cookies over HTTPS connections.

HTTPS redirects therefore work together with secure cookie configuration to protect authenticated sessions and sensitive application data.