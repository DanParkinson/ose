# Accounts Endpoints

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Endpoint Group](#endpoint-group)
- [Account Lifecycle Endpoints](#account-lifecycle-endpoints)
- [Authentication Relationship](#authentication-relationship)
- [Frontend Relationship](#frontend-relationship)
- [Related Documentation](#related-documentation)

## Purpose

Accounts endpoints provide custom account lifecycle functionality beyond the default authentication endpoints supplied by `dj-rest-auth`.

This document lists the available account-related routes only. Account lifecycle behaviour is documented separately.

## Endpoint Group

Accounts endpoints are grouped under:

```text
/api/accounts/
```

## Account Lifecycle Endpoints

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| `POST` | `/api/accounts/account/deactivate/` | Deactivate the current authenticated account | Authenticated |
| `POST` | `/api/accounts/account/reactivate/request/` | Request account reactivation email | Public |
| `POST` | `/api/accounts/account/reactivate/confirm/` | Confirm account reactivation using uid and token | Public |

## Authentication Relationship

These endpoints work alongside the authentication system.

Examples:

```text
Authenticated users can deactivate their account
Deactivated users cannot authenticate
Reactivated users can authenticate again
```

The backend remains responsible for:

```text
Permission validation
Token validation
Cookie handling
Account state updates
```

## Frontend Relationship

The frontend consumes these endpoints through dedicated account management and authentication forms.

Examples:

```text
DeactivateAccountForm
ReactivateRequestForm
ReactivateConfirmForm
```

The frontend submits requests and displays success or error responses while the backend performs the actual account lifecycle operations.

## Related Documentation

- [Account Deactivation](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/1.%20Accouts-app/3.%20Account-Lifecycle/ACCOUNT-DEACTIVATION.md

- [Account Reactivation](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/1.%20Accouts-app/3.%20Account-Lifecycle/ACCOUNT-REACTIVATION.md)

- [Authentication Forms](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/4.%20Frontend-auth/AUTHENTICATION-FORMS.md)

- [Auth Context](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/4.%20Frontend-auth/AUTH-CONTEXT.md)