# Mandatory Verification

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Mandatory Verification Was Chosen](#why-mandatory-verification-was-chosen)
- [Configuration](#configuration)
- [Platform Behaviour](#platform-behaviour)
- [User Experience](#user-experience)
- [Architecture Relationship](#architecture-relationship)

## Purpose

The platform requires users to verify ownership of their email address before they can authenticate.

This ensures that every authenticated account is associated with a valid, accessible email address.

Email verification forms part of the authentication system rather than acting as an optional account feature.

## Why Mandatory Verification Was Chosen

The platform uses email addresses as the primary account identifier.

Because email addresses are also used for:

```text
password recovery
account communication
account ownership verification
```

it is important that users can prove ownership of the address they register with.

For this reason, the platform uses mandatory verification rather than optional verification.

This prevents accounts from being used until ownership of the email address has been confirmed.

## Configuration

Mandatory verification is enabled through Django Allauth.

```py
ACCOUNT_EMAIL_VERIFICATION = "mandatory"
```

The platform also confirms email links through the verification flow.

```py
ACCOUNT_CONFIRM_EMAIL_ON_GET = True
```

The first setting makes verification required before authentication.

The second setting supports the verification link behaviour used by the frontend verification route.

## Platform Behaviour

Users are allowed to create accounts immediately.

However, authentication is restricted until verification is completed.

This creates a two-stage onboarding process:

```text
Account Creation
        ↓
Email Verification
        ↓
Authentication Access
```

The account exists after registration, but access to authenticated functionality is withheld until verification is successful.

## User Experience

From a user perspective:

```text
Register Account
        ↓
Receive Verification Email
        ↓
Verify Email Address
        ↓
Login
```

If verification has not been completed, login attempts are rejected until the email address has been confirmed.

This adds an additional step during onboarding but improves account integrity and reduces invalid registrations.

## Architecture Relationship

Mandatory verification acts as a bridge between registration and authentication.

```text
Registration
        ↓
Email Verification
        ↓
Authentication
```

The verification system determines whether an account is eligible to authenticate.

This ensures that account access is only granted once ownership of the registered email address has been confirmed.