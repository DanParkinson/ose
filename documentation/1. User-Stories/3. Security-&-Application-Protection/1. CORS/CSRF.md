# CSRF Trusted Origins

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Trusted Origins](#trusted-origins)
- [Cookie Authentication Relationship](#cookie-authentication-relationship)
- [Frontend Relationship](#frontend-relationship)
- [Production Configuration](#production-configuration)

## Purpose

Cross-Site Request Forgery (CSRF) protection helps ensure that authenticated requests originate from trusted frontend applications.

Because the platform uses cookie-based authentication, the backend must know which frontend origins are permitted to perform authenticated requests.

## Trusted Origins

Trusted frontend origins are configured through:

```py
CSRF_TRUSTED_ORIGINS = os.environ.get(
    "CSRF_TRUSTED_ORIGINS",
    "",
).split(",")
```

Development example:

```env
CSRF_TRUSTED_ORIGINS=http://localhost:5173
```

Production example:

```env
CSRF_TRUSTED_ORIGINS=https://open-source-education.co.uk,https://www.open-source-education.co.uk
```

Only origins included in this list are trusted for authenticated requests.

## Cookie Authentication Relationship

The platform uses JWT authentication cookies.

Authentication cookies are automatically included by the browser when authenticated requests are made.

Examples:

```text
access
refresh
```

Because cookies are sent automatically, CSRF protection is required to help ensure requests originate from trusted frontend applications rather than untrusted third-party sites.

CSRF protection is particularly important for requests that:

```text
Create data
Update data
Delete data
Perform account actions
```

## Frontend Relationship

The frontend must make requests from a trusted origin.

Development example:

```text
http://localhost:5173
```

Production example:

```text
https://open-source-education.co.uk
https://www.open-source-education.co.uk
```

If a new frontend domain is introduced, it must be added to:

```py
CSRF_TRUSTED_ORIGINS
```

before authenticated requests from that domain will be accepted.

## Production Configuration

Production deployments should only trust official frontend domains.

Example:

```env
CSRF_TRUSTED_ORIGINS=https://open-source-education.co.uk,https://www.open-source-education.co.uk
```

Restricting trusted origins helps ensure authenticated requests originate only from approved frontend applications while maintaining compatibility with cookie-based authentication.