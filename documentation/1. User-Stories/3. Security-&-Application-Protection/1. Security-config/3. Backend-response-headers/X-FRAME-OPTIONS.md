# X-Frame-Options

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why X-Frame-Options Is Needed](#why-x-frame-options-is-needed)
- [Django Configuration](#django-configuration)
- [Backend Behaviour](#backend-behaviour)
- [Related Frontend Header](#related-frontend-header)

## Purpose

`X-Frame-Options` controls whether backend pages can be embedded inside an iframe.

This helps protect the backend from clickjacking attacks.

## Why X-Frame-Options Is Needed

Clickjacking attacks happen when a malicious site embeds another site inside a hidden or disguised frame.

A user may think they are clicking one thing, while actually interacting with the embedded application.

For the backend, this is especially important because the application includes protected pages such as:

```text
Django Admin
API Schema Pages
Authenticated Backend Views
```

These pages should not be embedded inside another website.

## Django Configuration

The backend configures `X-Frame-Options` in Django settings.

```py
X_FRAME_OPTIONS = "DENY"
```

This tells browsers that backend responses should not be displayed inside a frame.

## Backend Behaviour

With this setting enabled, Django sends the following response header:

```text
X-Frame-Options: DENY
```

This means:

```text
No external website can embed backend pages in an iframe.
```

This protects backend routes such as:

```text
/admin/
/api/schema/swagger-ui/
/api/schema/redoc/
```

## Related Frontend Header

The frontend also has an `X-Frame-Options` header configured through Render.

The backend setting protects Django-served responses.

The Render frontend header protects the deployed React application.