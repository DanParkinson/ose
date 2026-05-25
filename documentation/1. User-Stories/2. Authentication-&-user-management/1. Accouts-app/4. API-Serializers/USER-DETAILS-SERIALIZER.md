# User Details Serializer

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Exposed Fields](#exposed-fields)
- [Authentication Relationship](#authentication-relationship)
- [Frontend Relationship](#frontend-relationship)

## Purpose

The user details serializer exposes authenticated user information to the frontend.

It provides the minimum user data required for authentication state management and permission-aware frontend rendering.

## Exposed Fields

The serializer currently exposes the following fields:

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

| Field | Purpose |
|---------|---------|
| `id` | Unique user identifier |
| `email` | Authenticated user email address |
| `is_staff` | Staff access indicator |
| `is_superuser` | Superuser access indicator |

## Authentication Relationship

The serializer is used by the authentication system to return information about the currently authenticated user.

This allows the frontend to determine:

```text
Current user identity
Authentication state
Available user permissions
```

The serializer does not perform authentication itself.

Authentication is handled by the backend authentication system before serializer data is returned.

## Frontend Relationship

The frontend consumes the serialized user data through the authentication system.

The returned values can be used for:

```text
Authentication state management
Protected route decisions
Permission-based rendering
Administrative interface access
```

The backend remains responsible for enforcing permissions and access control.

Frontend permission checks are used only for user interface behaviour.