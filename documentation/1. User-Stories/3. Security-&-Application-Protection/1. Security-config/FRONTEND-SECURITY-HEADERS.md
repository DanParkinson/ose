# Frontend Security Headers

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Strict-Transport-Security](#strict-transport-security)
- [Cross-Origin-Opener-Policy](#cross-origin-opener-policy)
- [X-Frame-Options](#x-frame-options)

## Purpose

The frontend is configured to send additional HTTP security headers through Render.

These headers improve browser security by enforcing HTTPS, isolating the application from cross-origin browsing contexts, and protecting against clickjacking attacks.

---

## Strict-Transport-Security

The frontend sends an HSTS header to ensure browsers always communicate using HTTPS.

```text
Strict-Transport-Security:
max-age=31536000; includeSubDomains; preload
```

This provides long-term HTTPS enforcement for the deployed frontend and all supported subdomains.

---

## Cross-Origin-Opener-Policy

The frontend enables browser isolation using:

```text
Cross-Origin-Opener-Policy: same-origin
```

This places the application into its own browsing context group, reducing the risk of cross-origin information leakage and other browser-based attacks.

---

## X-Frame-Options

The frontend prevents the React application from being embedded inside an iframe using:

```text
X-Frame-Options: DENY
```

This protects the deployed application from clickjacking attacks.

The backend also applies this header through Django, ensuring both the frontend and backend are protected.
