# Custom Account Adapter

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why a Custom Adapter Is Needed](#why-a-custom-adapter-is-needed)
- [Configuration](#configuration)
- [Frontend URL Relationship](#frontend-url-relationship)
- [Email Template Relationship](#email-template-relationship)
- [User Experience](#user-experience)

## Purpose

The custom account adapter extends Django Allauth's default account behaviour so authentication emails can work correctly with the React frontend.

The main purpose of the adapter is to provide frontend-specific context to email templates.

This allows verification emails to generate links that point to the frontend application rather than relying only on backend URLs.

## Why a Custom Adapter Is Needed

The platform uses a separate frontend and backend.

Because of this, verification links need to send users to the frontend route where the verification page exists.

The adapter allows the backend email system to include the correct frontend URL when rendering authentication email templates.

This avoids hardcoded development or production URLs inside templates.

## Configuration

The custom adapter is enabled in Django settings.

```py
ACCOUNT_ADAPTER = "accounts.adapter.CustomAccountAdapter"
```

The frontend URL is also configured through environment settings.

```py
FRONTEND_URL = os.environ.get(
    "FRONTEND_URL",
    "http://localhost:5173"
)
```

This allows the same email template system to work in both development and production.

## Frontend URL Relationship

The adapter connects Django email generation to the frontend application.

Development:

```text
http://localhost:5173
```

Production:

```text
https://open-source-education.co.uk
```

This means verification emails can generate links such as:

```text
{{ frontend_url }}/verify-email/{{ key }}
```

instead of using a hardcoded URL.

## Email Template Relationship

The custom adapter makes `frontend_url` available inside email templates.

This allows templates to stay environment-independent.

Example template usage:

```text
Please verify your email address by clicking the link below:

{{ frontend_url }}/verify-email/{{ key }}
```

The template does not need to know whether the application is running locally or in production.

## User Experience

From the user's perspective, the verification email contains a link that takes them directly to the frontend verification page.

```text
User registers
        ↓
Verification email is sent
        ↓
Email contains frontend verification link
        ↓
User opens link
        ↓
Frontend verification page handles confirmation
```

This creates a smoother verification flow because users interact with the frontend application rather than a backend-only confirmation page.

## Architecture Relationship

The custom account adapter sits between:

```text
Django Allauth
        ↓
Email Template Rendering
        ↓
Frontend Verification Route
```

It keeps email verification flexible by allowing deployment-specific values to come from environment configuration rather than being hardcoded inside templates.