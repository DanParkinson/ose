# User Serializers

## Navigation

[← Back to README.md](/README.md)

[← Back to BACKEND.md](/docs/documentation/backend/BACKEND.md)

## Table of Contents

- [Purpose](#purpose)
- [Custom Registration Serializer](#custom-registration-serializer)
  - [Username Removal](#username-removal)
  - [Email Validation](#email-validation)
- [Custom User Details Serializer](#custom-user-details-serializer)
  - [Frontend Authentication State](#frontend-authentication-state)
  - [Permission-Based Frontend Rendering](#permission-based-frontend-rendering)
- [Serializer Philosophy](#serializer-philosophy)

## Purpose

This document explains the custom serializers used throughout the authentication system.

The platform customizes authentication serializers to support:

```text
email-first authentication
frontend-compatible authentication state
custom registration validation
permission-aware frontend rendering
```

## Custom Registration Serializer

The backend customizes registration behaviour using:

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

### Username Removal

The serializer removes username registration.

```py
username = None
```

The platform intentionally uses:

```text
email-first authentication
```

instead of username-based authentication.

### Email Validation

The serializer validates email uniqueness.

```py
if User.objects.filter(email=email).exists():
```

Duplicate registration attempts return a validation error instead of creating duplicate accounts.

This prevents multiple accounts from using the same email address.

## Custom User Details Serializer

Authenticated user data is exposed using:

```py
class CustomUserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "is_staff",
            "is_superuser",
        ]
```

### Frontend Authentication State

The serializer provides the frontend with:

| Field | Purpose |
|---|---|
| `id` | User identifier |
| `email` | Authenticated user email |
| `is_staff` | Admin dashboard access |
| `is_superuser` | Superuser access checks |

This supports:

```text
authentication state management
authenticated frontend rendering
admin-only UI rendering
```

### Permission-Based Frontend Rendering

The frontend uses serializer values to conditionally render protected UI components.

Example:

```text
admin dashboard navigation
staff-only management features
superuser-only controls
```

The backend remains responsible for actual permission enforcement.

Frontend permission checks are used for UI rendering only.

## Serializer Philosophy

The authentication serializers are designed around:

```text
minimal authentication complexity
frontend-compatible responses
email-first authentication
predictable validation behaviour
permission-aware frontend state
```

The goal is to keep serializer responses simple while supporting secure authentication workflows.
