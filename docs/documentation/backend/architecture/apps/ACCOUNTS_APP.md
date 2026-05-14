# Accounts App

## Navigation

[← Back to README.md](/README.md)

[← Back to BACKEND.md](/docs/documentation/backend/BACKEND.md)

## Table of Contents

- [Core Responsibilities](#core-responsibilities)
- [Authentication Philosophy](#authentication-philosophy)
- [Custom User Model](#custom-user-model)
- [Custom User Manager](#custom-user-manager)
- [Registration Customization](#registration-customization)
- [User Details Serialization](#user-details-serialization)
- [Account Deactivation System](#account-deactivation-system)
- [Account Reactivation System](#account-reactivation-system)
- [API Integration](#api-integration)
- [Frontend Relationship](#frontend-relationship)
- [Architectural Philosophy](#architectural-philosophy)

## Purpose

The `accounts` app is responsible for authentication and account management throughout the platform.

It provides:

```text
custom user management
email-based authentication
registration customization
JWT-compatible user serialization
account deactivation
account reactivation
```

The app extends Django’s default authentication system to support a simplified email-only login workflow.

## Core Responsibilities

| Responsibility | Purpose |
|---|---|
| Custom user model | Replaces username authentication with email authentication |
| Authentication support | Integrates with JWT authentication |
| Registration customization | Controls registration validation and serializer behaviour |
| User serialization | Exposes authenticated user data to the frontend |
| Account lifecycle management | Handles account deactivation and reactivation |

## Authentication Philosophy

The platform uses:

```text
email-based authentication
JWT cookie authentication
frontend-controlled session handling
```

Usernames are intentionally removed from the authentication system.

## Custom User Model

The app provides a custom user model:

```py
class CustomUser(AbstractUser):
```

The default Django username field is removed.

```py
username = None
```

Authentication instead uses:

```py
USERNAME_FIELD = "email"
```

This creates a simplified login experience where users authenticate only through email and password.

## Custom User Manager

The app provides a custom user manager.

```py
class CustomUserManager(BaseUserManager):
```

The manager handles:

```text
email normalization
password hashing
superuser creation
email validation
```

This replaces Django’s default username-based user creation workflow.

## Registration Customization

The app customizes dj-rest-auth registration behaviour using:

```py
CustomRegisterSerializer
```

This serializer currently handles:

```text
email uniqueness validation
username removal
```

The serializer prevents duplicate email registration attempts.

## User Details Serialization

The app exposes authenticated user data using:

```py
CustomUserDetailsSerializer
```

This serializer currently returns:

```text
id
email
is_staff
is_superuser
```

This supports frontend authentication state and admin access checks.

## Account Deactivation System

The app supports soft account deactivation.

Deactivation:

```text
marks the account inactive
stores deactivation timestamp
removes JWT cookies
```

The account is not deleted from the database.

## Account Reactivation System

The app also supports account reactivation.

The workflow uses:

```text
email-based reactivation requests
token generation
secure reactivation confirmation
```

This allows previously deactivated users to restore their accounts safely.

## API Integration

The accounts app integrates with:

```text
dj-rest-auth
django-allauth
SimpleJWT
```

It extends the default authentication behaviour while remaining compatible with DRF authentication workflows.

## Frontend Relationship

The frontend uses the accounts app for:

```text
registration
login
logout
authenticated user state
admin access checks
account deactivation
account reactivation
```

Authentication state is primarily managed through JWT cookies.

## Architectural Philosophy

The accounts app is designed around:

```text
simple authentication
email-first login
minimal public user data
secure account lifecycle management
JWT compatibility
```

The goal is to keep authentication predictable while minimizing unnecessary account complexity.
