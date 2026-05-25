# Account Deactivation

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Deactivation Approach](#deactivation-approach)
- [Access Requirements](#access-requirements)
- [Deactivation Workflow](#deactivation-workflow)
- [Account State](#account-state)
- [Session Handling](#session-handling)
- [Frontend Relationship](#frontend-relationship)
- [Account Reactivation Relationship](#account-reactivation-relationship)

## Purpose

Account deactivation allows authenticated users to disable their account without permanently deleting it.

The platform uses account deactivation instead of account deletion so that user data can be preserved and restored later if required.

## Deactivation Approach

The platform uses a soft-deactivation workflow.

When an account is deactivated:

```text
The account remains in the database
Authentication access is removed
The deactivation timestamp is recorded
```

This allows the account to be restored through the account reactivation workflow.

## Access Requirements

Only authenticated users can deactivate their own account.

The endpoint uses:

```py
permission_classes = [IsAuthenticated]
```

The authenticated user is obtained from:

```py
request.user
```

This prevents users from attempting to deactivate other accounts.

## Deactivation Workflow

```text
Authenticated user submits deactivation request
    ↓
Backend identifies request.user
    ↓
Account is marked inactive
    ↓
Deactivation timestamp is stored
    ↓
Authentication cookies are removed
    ↓
User session ends
```

## Account State

Deactivation updates the account to:

```py
is_active = False
deactivated_at = timezone.now()
```

The account remains stored in the database but can no longer be used for normal authenticated access.

## Session Handling

After the account is deactivated, authentication cookies are removed.

```py
response.delete_cookie("access")
response.delete_cookie("refresh")
```

This immediately ends the current authenticated session and logs the user out.

## Frontend Relationship

The frontend is responsible for:

```text
Displaying the deactivation interface
Requesting confirmation before deactivation
Submitting the deactivation request
Updating authentication state
Redirecting the user after successful deactivation
```

The backend remains responsible for performing the actual account deactivation.

## Account Reactivation Relationship

Account deactivation works alongside the account reactivation system.

Because accounts are not permanently deleted, a deactivated account can later be restored through the reactivation workflow.

This allows users to disable access to their account without losing account data.