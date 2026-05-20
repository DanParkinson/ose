# Registration

## Navigation

[← Back to README.md](/README.md)

[← Back to BACKEND.md](/docs/documentation/backend/BACKEND.md)

## Table of Contents

- [Purpose](#purpose)
- [Registration Architecture](#registration-architecture)
- [Registration Configuration](#registration-configuration)
  - [Username Removal](#username-removal)
  - [Email Authentication](#email-authentication)
  - [Signup Fields](#signup-fields)
  - [Email Verification](#email-verification)
- [Custom Registration Serializer](#custom-registration-serializer)
  - [Email Validation](#email-validation)
- [Registration Philosophy](#registration-philosophy)

## Purpose

This document explains the registration architecture used throughout the platform.

The registration system is built around:

```text
email-first authentication
minimal account complexity
JWT-compatible registration workflows
frontend-compatible validation responses
```

The platform intentionally removes username-based authentication in favour of email authentication.

## Registration Architecture

The registration system is designed around:

```text
email registration
JWT cookie authentication
frontend-managed registration state
backend-managed validation
```

The backend validates registration requests and returns serializer validation errors where required.

## Registration Configuration

### Username Removal

The platform removes username authentication.

```py
ACCOUNT_USER_MODEL_USERNAME_FIELD = None
```

Users authenticate using:

```text
email
password
```

instead of usernames.

### Email Authentication

The backend configures allauth to use email authentication.

```py
ACCOUNT_LOGIN_METHODS = {"email"}
```

The platform intentionally uses:

```text
email-first authentication
```

throughout the application.

### Signup Fields

The backend defines the registration fields using:

```py
ACCOUNT_SIGNUP_FIELDS = [
    "email*",
    "password1*",
    "password2*"
]
```

Required registration fields:

| Field | Purpose |
|---|---|
| `email` | Authentication identity |
| `password1` | Password |
| `password2` | Password confirmation |

### Email Verification

The backend currently disables email verification.

```py
ACCOUNT_EMAIL_VERIFICATION = "none"
```

This simplifies development authentication workflows.

In production, email verification may later be enabled.

## Custom Registration Serializer

The platform customizes registration behaviour using:

```py
class CustomRegisterSerializer(RegisterSerializer):
    username = None

    def validate_email(self, email):
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                "A user with this email address already exists."
            )

        return email
```

### Email Validation

The serializer validates email uniqueness.

```py
if User.objects.filter(email=email).exists():
```

Duplicate registration attempts return a validation error instead of creating duplicate accounts.

This prevents multiple accounts from using the same email address.

## Registration Philosophy

The registration system is designed around:

```text
minimal account complexity
email-first authentication
predictable validation behaviour
frontend-compatible serializer responses
simple development workflows
```

The goal is to keep registration simple while remaining compatible with JWT authentication and frontend state management.
