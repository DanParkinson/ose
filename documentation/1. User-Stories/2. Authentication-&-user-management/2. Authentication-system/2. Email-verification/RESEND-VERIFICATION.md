# Resend Verification

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Resend Verification Exists](#why-resend-verification-exists)
- [Endpoint](#endpoint)
- [Request Format](#request-format)
- [Platform Behaviour](#platform-behaviour)
- [Frontend Relationship](#frontend-relationship)
- [User Experience](#user-experience)
- [Architecture Relationship](#architecture-relationship)

## Purpose

The resend verification functionality allows users to request a new verification email if they have not received the original verification message.

This helps reduce registration friction caused by:

```text
Spam filtering
Deleted emails
Expired inbox sessions
Accidental email loss
```

without requiring users to create a new account.

## Why Resend Verification Exists

Email delivery can never be guaranteed.

Although the platform sends a verification email immediately after registration, users may:

```text
Miss the email
Delete the email
Lose access to the original message
```

Providing a resend mechanism allows users to continue the verification process without contacting support or repeating registration.

## Endpoint

The platform uses DJ-Rest-Auth's resend verification endpoint.

```text
POST /api/auth/registration/resend-email/
```

The endpoint generates a new verification email for accounts that have not yet been verified.

## Request Format

The endpoint accepts an email address.

Example:

```json
{
    "email": "user@example.com"
}
```

The email address is used to locate the account associated with the verification request.

## Platform Behaviour

For unverified accounts:

```text
Verification email requested
        ↓
New verification email generated
        ↓
Email delivered
```

For already verified accounts:

```text
Verification email requested
        ↓
Account already verified
        ↓
No verification email sent
```

The verification state of the account determines whether a new email is generated.

## Frontend Relationship

The frontend provides a dedicated interface where users can request a replacement verification email.

The frontend is responsible for:

```text
Collecting the email address
Submitting the request
Displaying feedback messages
```

The backend remains responsible for:

```text
Account lookup
Verification status checks
Verification email generation
Email delivery
```

## User Experience

Typical user journey:

```text
User registers
        ↓
Verification email not received
        ↓
User opens resend verification page
        ↓
Email address submitted
        ↓
New verification email received
        ↓
Verification completed
```

This allows users to recover from email delivery issues without repeating registration.

## Architecture Relationship

The resend verification workflow extends the standard verification process.

```text
Registration
        ↓
Verification Email
        ↓
Verification Not Completed
        ↓
Resend Verification
        ↓
New Verification Email
        ↓
Verification Completed
```

The resend functionality does not introduce a separate verification system.

Instead, it provides an alternative entry point into the existing email verification workflow.