# SMTP Configuration

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [SMTP Provider](#smtp-provider)
- [Google Workspace SMTP](#google-workspace-smtp)
- [Django Configuration](#django-configuration)
- [Environment Variables](#environment-variables)
- [Related Infrastructure](#related-infrastructure)

## Purpose

SMTP configuration allows Django to send real emails in production.

This is required for platform email workflows such as:

```text
Email verification
Password reset
Account reactivation
```

## SMTP Provider

The platform uses Google Workspace as the SMTP provider.

Google Workspace handles the actual delivery of emails after Django creates and sends the message.

## Google Workspace SMTP

The production SMTP configuration uses:

```text
Host: smtp.gmail.com
Port: 587
Encryption: TLS
```

This allows Django to authenticate with Google Workspace and send emails through the project domain.

## Development vs Production

The platform uses different email backends depending on the environment.

### Development

During local development, emails are written to the console rather than being delivered.

```py
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
```

This allows authentication workflows such as:

```text
Email verification
Password reset
Account reactivation
```

to be tested without requiring a real email service.

### Production

In production, the platform switches to the SMTP backend.

```py
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
```

This allows Django to send emails through Google Workspace.

SMTP credentials are configured through Render environment variables and are not stored in source control.

The password is stored outside the codebase and must never be committed to source control.

## Related Infrastructure

SMTP delivery depends on the wider email infrastructure:

```text
Google Workspace
Primary Mailbox
Email Aliases
SPF
DKIM
DMARC
Render Environment Variables
```

Django creates the email, Google Workspace sends it, and DNS authentication records help receiving mail providers trust it.