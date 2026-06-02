# Frontend URL Configuration

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

* [Purpose](#purpose)
* [Why Frontend URL Configuration Is Needed](#why-frontend-url-configuration-is-needed)
* [Configuration](#configuration)
* [Development Configuration](#development-configuration)
* [Production Configuration](#production-configuration)
* [Email Verification Relationship](#email-verification-relationship)
* [Related Infrastructure](#related-infrastructure)

## Purpose

The frontend URL configuration provides a single source of truth for the application's frontend address.

This allows backend-generated emails to create links that point users to the correct frontend application.

## Why Frontend URL Configuration Is Needed

The platform uses separate frontend and backend applications.

Because of this separation, authentication emails cannot rely on backend URLs when directing users to frontend pages.

Examples include:

```text
Email Verification
Password Reset
Account Reactivation
```

These workflows require users to interact with frontend pages rather than backend endpoints.

## Configuration

The frontend URL is configured through the Django settings file.

Example:

```py
FRONTEND_URL = os.environ.get(
    "FRONTEND_URL",
    "http://localhost:5173"
)
```

This allows the same codebase to support both local development and production deployments.

## Development Configuration

During local development:

```text
http://localhost:5173
```

is used as the default frontend URL.

This allows authentication emails generated through the console backend to contain links that point to the local React application.

## Production Configuration

In production, the frontend URL is provided through Render environment variables.

Example:

```text
https://open-source-education.co.uk
```

This ensures that authentication emails sent to real users contain links that point to the deployed frontend application.

## Email Verification Relationship

The frontend URL is used by the custom account adapter when generating verification emails.

Example template usage:

```text
{{ frontend_url }}/verify-email/{{ key }}
```

This allows verification emails to direct users to the frontend verification page while keeping the actual domain configurable.

Without the frontend URL configuration, authentication emails would need to contain hardcoded links.

## Related Infrastructure

The frontend URL configuration works together with:

```text
Custom Account Adapter
Verification Email Template
Email Verification
Password Reset
Render Environment Variables
```

These components allow backend-generated emails to integrate correctly with frontend authentication workflows.
