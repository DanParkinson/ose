# Primary Mailbox

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Mailbox Configuration](#mailbox-configuration)
- [Platform Usage](#platform-usage)
- [Django Integration](#django-integration)
- [Related Infrastructure](#related-infrastructure)

## Purpose

The platform uses a dedicated Google Workspace mailbox for automated application emails.

This mailbox provides the sender identity used by Django when sending account-related emails.

## Mailbox Configuration

The mailbox was created through Google Workspace and connected to:

```text
open-source-education.co.uk
```

This mailbox is used as the primary sender account for the application.

Example:

```text
accounts@open-source-education.co.uk
```

## Platform Usage

The mailbox is responsible for sending:

```text
Email verification
Password reset
Account reactivation
```

Additional platform communications can also be sent from this mailbox in the future.

## Django Integration

Django connects to the mailbox through SMTP configuration.

Example:

```py
EMAIL_HOST
EMAIL_PORT
EMAIL_HOST_USER
EMAIL_HOST_PASSWORD
DEFAULT_FROM_EMAIL
```

The credentials are stored in environment variables and are not committed to source control.

When Django sends an email:

```text
Django
    ↓
Google Workspace SMTP
    ↓
Recipient Inbox
```

Google Workspace handles the actual delivery.

## Related Infrastructure

This mailbox works together with:

```text
Google Workspace
SPF
DKIM
DMARC
SMTP Configuration
```

These systems allow emails sent from the mailbox to be authenticated and delivered reliably.