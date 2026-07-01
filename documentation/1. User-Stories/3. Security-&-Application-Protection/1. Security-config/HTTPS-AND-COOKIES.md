# HTTPS & Cookie Security

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [HTTPS Redirects](#https-redirects)
- [Secure Cookies](#secure-cookies)
- [HTTP Strict Transport Security (HSTS)](#http-strict-transport-security-hsts)

## Purpose

The application uses HTTPS and secure cookie configuration to protect authentication tokens and sensitive data during transmission.

These settings ensure requests are encrypted, cookies are only transmitted over secure connections, and browsers automatically use HTTPS in production.

---

## HTTPS Redirects

HTTP requests are automatically redirected to HTTPS in production using:

```python
SECURE_SSL_REDIRECT = not DEBUG
```

This ensures all communication between the frontend and backend is encrypted while allowing HTTP during local development.

---

## Secure Cookies

Authentication, session and CSRF cookies are configured to use secure browser settings.

```python
JWT_AUTH_SECURE = not DEBUG
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG

JWT_AUTH_SAMESITE = "Lax" if DEBUG else "None"
```

Production uses secure cookies over HTTPS, while development relaxes these settings to support local testing.

---

## HTTP Strict Transport Security (HSTS)

HSTS instructs browsers to automatically use HTTPS after the first secure connection.

```python
SECURE_HSTS_SECONDS = 0 if DEBUG else 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = not DEBUG
SECURE_HSTS_PRELOAD = not DEBUG
```

This provides long-term HTTPS enforcement, protects all subdomains in production, and supports browser preload lists.
