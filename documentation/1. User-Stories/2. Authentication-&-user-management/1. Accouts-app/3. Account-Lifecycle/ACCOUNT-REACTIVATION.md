# Account Reactivation

## Navigation

[← Back to README.md](/README.md)

[← Back to ACCOUNTS.md](/docs/documentation/accounts/ACCOUNTS.md)

## Table of Contents

- [Purpose](#purpose)
- [Reactivation Approach](#reactivation-approach)
- [Reactivation Request](#reactivation-request)
- [Reactivation Confirmation](#reactivation-confirmation)
- [Security Behaviour](#security-behaviour)
- [Account State](#account-state)
- [Email Relationship](#email-relationship)
- [Frontend Relationship](#frontend-relationship)

## Purpose

Account reactivation allows previously deactivated accounts to be restored without requiring users to create a new account.

The system uses email verification and secure token validation to confirm account ownership before access is restored.

## Reactivation Approach

The platform uses an email-based account recovery workflow.

Users submit the email address associated with their deactivated account.

If a matching inactive account exists, the backend generates a secure reactivation link and sends it to the registered email address.

Only users with access to the account email can complete the reactivation process.

## Reactivation Request

The reactivation request endpoint is publicly accessible.

```py
permission_classes = [AllowAny]
```

This is necessary because deactivated users can no longer authenticate.

The workflow is:

```text
User submits email address
    ↓
Backend searches for inactive account
    ↓
Secure uid generated
    ↓
Secure token generated
    ↓
Reactivation link sent by email
    ↓
Generic success response returned
```

The generated reactivation link contains:

```text
Encoded user identifier
Secure reactivation token
```

These values are later used to verify the reactivation request.

## Reactivation Confirmation

When the user follows the reactivation link, the frontend submits the uid and token to the confirmation endpoint.

The workflow is:

```text
Frontend submits uid and token
    ↓
Backend decodes uid
    ↓
Backend validates inactive account
    ↓
Backend validates token
    ↓
Account is restored
    ↓
Success response returned
```

If either the uid or token is invalid, the request is rejected.

## Security Behaviour

The reactivation system uses two security protections.

### Generic Responses

The request endpoint always returns the same response regardless of whether a matching account exists.

This prevents account enumeration attacks by avoiding disclosure of registered email addresses.

### Token Validation

The confirmation endpoint validates:

```text
User identity
Token authenticity
Token expiry
User-token relationship
```

Only valid reactivation tokens can restore an account.

## Account State

Successful reactivation updates the account to:

```py
is_active = True
deactivated_at = None
```

This restores the account to a normal active state.

The user can then authenticate again using their existing email address and password.

## Email Relationship

Account reactivation depends on the configured Django email backend.

The backend sends reactivation emails containing the secure reactivation link.

During development, emails are written to the console email backend.

In production, the email backend can be replaced with a real email provider.

## Token Validation

Account reactivation uses Django's built-in token generation system.

```py
default_token_generator.make_token(user)
```

A secure token is generated when the reactivation request is created.

During confirmation:

```py
default_token_generator.check_token(user, token)
```

The token is validated before the account is restored.

Invalid or expired tokens are rejected and the account remains inactive.

## Frontend Relationship

The frontend is responsible for:

```text
Displaying the reactivation request form
Submitting the user's email address
Displaying the reactivation confirmation page
Submitting the uid and token
Displaying success messages
Displaying validation errors
```

The backend remains responsible for:

```text
Account lookup
UID generation
Token generation
Token validation
Account restoration
```