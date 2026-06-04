# Auth Endpoints

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Endpoint Group](#endpoint-group)
- [Authentication Endpoints](#authentication-endpoints)
- [Frontend Relationship](#frontend-relationship)
- [Related Documentation](#related-documentation)

## Purpose

Auth endpoints provide the API routes used for registration, login, logout, user retrieval, and password management.

Most authentication endpoints are provided by `dj-rest-auth` and are consumed by the frontend authentication system.

This document lists the available auth routes only. Authentication behaviour and configuration are documented separately.

## Endpoint Group

Auth endpoints are grouped under:

```text
/api/auth/
```

## Authentication Endpoints

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| `POST` | `/api/auth/registration/` | Register a new user account | Public |
| `POST` | `/api/auth/login/` | Authenticate user and issue auth cookies | Public |
| `POST` | `/api/auth/logout/` | End authenticated session | Authenticated |
| `GET` | `/api/auth/user/` | Retrieve current authenticated user | Authenticated |
| `POST` | `/api/auth/password/change/` | Change authenticated user's password | Authenticated |
| `POST` | `/api/auth/password/reset/` | Request password reset email | Public |
| `POST` | `/api/auth/password/reset/confirm/` | Confirm password reset with uid and token | Public |

- [Authentication Endpoints](#authentication-endpoints)
- [Email Verification Endpoints](#email-verification-endpoints)
- [Frontend Relationship](#frontend-relationship)
- [Related Documentation](#related-documentation)

## Purpose

Auth endpoints provide the API routes used for:

```text
Registration
Authentication
Session Management
Email Verification
Password Management
```

Most authentication endpoints are provided by `dj-rest-auth` and `django-allauth` and are consumed by the frontend authentication system.

This document provides an overview of the available authentication routes. Authentication behaviour and configuration are documented separately.

## Endpoint Group

Authentication endpoints are grouped under:

```text
/api/auth/
```

## Authentication Endpoints

| Method | Endpoint | Purpose | Access |
|----------|----------|----------|----------|
| `POST` | `/api/auth/registration/` | Register a new user account | Public |
| `POST` | `/api/auth/login/` | Authenticate user and issue auth cookies | Public |
| `POST` | `/api/auth/logout/` | End authenticated session | Authenticated |
| `GET`  | `/api/auth/user/` | Retrieve current authenticated user | Authenticated |
| `POST` | `/api/auth/password/change/` | Change authenticated user's password | Authenticated |
| `POST` | `/api/auth/password/reset/` | Request password reset email | Public |
| `POST` | `/api/auth/password/reset/confirm/` | Confirm password reset using uid and token | Public |

## Email Verification Endpoints

| Method | Endpoint | Purpose | Access |
|----------|----------|----------|----------|
| `POST` | `/api/auth/registration/account-confirm-email/<key>/` | Verify email address using confirmation key | Public |
| `POST` | `/api/auth/registration/resend-email/` | Request a new verification email | Public |



## Frontend Relationship

The frontend uses these endpoints through the authentication context and authentication forms.

Examples:

```text
LoginForm        → /api/auth/login/
RegisterForm     → /api/auth/registration/
AuthContext      → /api/auth/user/
ChangePassword   → /api/auth/password/change/
```

The frontend does not manually manage JWT tokens.

Authentication cookies are handled by the browser and validated by the backend.

## Related Documentation

- [DJ-Rest-Auth](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/2.%20Authentication-system/DJ-REST-AUTH.md)
- [JWT Cookie Authentication](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/2.%20Authentication-system/JWT-COOKIE-AUTH.md)
- [Auth Context](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/4.%20Frontend-auth/AUTH-CONTEXT.md)
- [Authentication Forms](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/4.%20Frontend-auth/AUTHENTICATION-FORMS.md)