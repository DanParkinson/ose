# Email Configuration

## Navigation

[← Back to README.md](/README.md)

[← Back to BACKEND.md](/docs/documentation/backend/BACKEND.md)

## Table of Contents

- [Purpose](#purpose)
- [Email Backend](#email-backend)
- [Development Email Backend](#development-email-backend)
- [Production Email Backend](#production-email-backend)
- [Authentication Integration](#authentication-integration)
- [Email Verification](#email-verification)
- [Future Email Features](#future-email-features)

## Purpose

This document explains the email configuration architecture used throughout the platform.

The email system supports:

```text
authentication workflows
password reset workflows
email verification
development debugging
future production email delivery
```

The platform currently uses Django's console email backend during development.

## Email Backend

The backend configures email handling using:

```py
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
```

`EMAIL_BACKEND` controls how Django sends emails.

Different backends can be used for development and production environments.

## Development Email Backend

The platform currently uses Django’s console email backend.

```py
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
```

Emails are printed directly to the terminal instead of being sent through a real email provider.

This simplifies development because:

```text
no SMTP provider is required
emails can be inspected locally
authentication workflows can be tested safely
```

The console backend is intended for development only.

## Production Email Backend

In production, the console backend should be replaced with a real email provider.

Common production email providers include:

```text
SMTP
SendGrid
Mailgun
Amazon SES
```

Production email configuration is not yet implemented.

## Authentication Integration

The email system integrates with the authentication system through:

```text
registration workflows
password reset workflows
email verification workflows
```

Authentication packages such as:

```text
django-allauth
dj-rest-auth
```

use Django’s configured email backend automatically.

## Email Verification

The backend currently disables email verification.

```py
ACCOUNT_EMAIL_VERIFICATION = "none"
```

This simplifies development authentication workflows.

Email verification may later be enabled in production environments.

## Future Email Features

Planned future email functionality may include:

```text
mandatory email verification
password reset emails
account recovery workflows
notification emails
admin notifications
```
