# Email Backend

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

* [Purpose](#purpose)
* [Email Backend Role](#email-backend-role)
* [Development Backend](#development-backend)
* [Console Email Output](#console-email-output)
* [Current Email Workflows](#current-email-workflows)
* [Production Relationship](#production-relationship)

## Purpose

The email backend defines how Django sends email messages from the application.

The platform currently uses Django's console email backend during local development so that email workflows can be tested without connecting to a real email provider.

## Email Backend Role

Django uses the `EMAIL_BACKEND` setting to determine how generated email messages are delivered.

Authentication-related features generate email messages which are then passed to the configured email backend.

Current email workflows include:

```text
Email Verification
Resend Verification Email
Password Reset
Account Reactivation
```

The email backend is responsible for delivery, while the authentication system is responsible for deciding when an email should be generated.

## Development Backend

The platform currently uses Django's console email backend.

```py
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
```

This backend does not send real emails.

Instead, generated emails are written directly to the Django terminal.

This allows authentication workflows to be developed and tested without requiring SMTP credentials or an external email provider.

## Console Email Output

When an email is generated during development, Django prints the complete message to the terminal.

The output includes:

```text
Subject
Sender
Recipient
Message Body
Verification Links
Reset Links
```

This allows links to be copied directly from the terminal during testing.

Example workflow:

```text
User Registers
↓
Verification Email Generated
↓
Email Printed To Terminal
↓
Verification Link Copied
↓
Frontend Verification Page Opened
↓
Verification Submitted
```
