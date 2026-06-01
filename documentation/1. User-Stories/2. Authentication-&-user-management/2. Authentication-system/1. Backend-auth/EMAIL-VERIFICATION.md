# Email Verification

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

* [Purpose](#purpose)
* [Verification Approach](#verification-approach)
* [Mandatory Verification](#mandatory-verification)
* [Django Allauth Integration](#django-allauth-integration)
* [EmailAddress Model](#emailaddress-model)
* [Verification Email Templates](#verification-email-templates)
* [Verification Endpoint](#verification-endpoint)
* [Resend Verification Endpoint](#resend-verification-endpoint)
* [Frontend Relationship](#frontend-relationship)

## Purpose

Email verification is used to confirm ownership of an email address before a user can authenticate with the platform.

The verification system helps prevent invalid account creation and ensures password recovery and account communications can be delivered to a valid email address.

## Verification Approach

The platform uses Django Allauth's email verification system through DJ-Rest-Auth registration workflows.

When a user registers:

```text
Account Created
↓
Verification Email Generated
↓
EmailAddress Created
↓
Verified = False
↓
User Cannot Login
```

Once verification is completed:

```text
Verification Submitted
↓
EmailAddress Verified
↓
User Can Login
```

The platform relies on Allauth's built-in verification workflow rather than a custom implementation.

## Mandatory Verification

Email verification is configured as mandatory.

```py
ACCOUNT_EMAIL_VERIFICATION = "mandatory"
```

This prevents users from authenticating until their email address has been successfully verified.

Unverified users may register successfully but login requests are rejected until verification is completed.

## Django Allauth Integration

Email verification is provided by Django Allauth.

The authentication system uses Allauth's email management features to:

```text
Generate verification emails
Store verification state
Validate verification keys
Manage email confirmation workflows
```

DJ-Rest-Auth exposes these workflows through REST API endpoints used by the frontend.

## EmailAddress Model

Verification status is stored using Allauth's EmailAddress model.

The model maintains:

```text
Email Address
Verification Status
Primary Email Status
Associated User
```

Verification state is not stored directly on the custom user model.

Instead, verification is determined through the related EmailAddress record.

Example:

```text
verified = False
```

User cannot login.

```text
verified = True
```

User can login.

## Verification Email Templates

Verification emails use custom template overrides.

The platform currently uses plain text email templates.

Templates include:

```text
email_confirmation_signup_subject.txt
email_confirmation_signup_message.txt
```

These templates generate verification links that direct users to the frontend verification route.

## Verification Endpoint

The verification workflow uses DJ-Rest-Auth's verification endpoint.

```text
POST /api/auth/registration/verify-email/
```

The endpoint accepts:

```json
{
    "key": "verification-key"
}
```

A valid verification key updates the associated EmailAddress record and marks the email address as verified.

Successful response:

```json
{
    "detail": "ok"
}
```

## Resend Verification Endpoint

Users can request a new verification email using:

```text
POST /api/auth/registration/resend-email/
```

The endpoint accepts:

```json
{
    "email": "user@example.com"
}
```

For unverified accounts:

```text
New verification email generated
```

For already verified accounts:

```text
No additional verification email sent
```

The endpoint always returns a successful response to avoid exposing unnecessary account information.

## Frontend Relationship

The frontend is responsible for:

```text
Displaying registration success messages
Displaying verification forms
Submitting verification keys
Providing resend verification functionality
Displaying verification errors
```

The backend remains responsible for:

```text
Verification email generation
Verification key validation
Verification status storage
Email confirmation workflows
Login restrictions for unverified accounts
```

The frontend never determines verification status itself and relies entirely on backend validation.
