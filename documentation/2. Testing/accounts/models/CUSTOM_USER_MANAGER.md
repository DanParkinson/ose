# Custom User Manager Test Overview

## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/backend/testing/TESTING_OVERVIEW.md)

## Legend

| Symbol | Meaning |
|---------|---------|
| ✅      | Test implemented |
| ❌      | Test not implemented |
| ➖      | Not required |

## create_user()

| Test Case                                              | Status |
|--------------------------------------------------------|--------|
| Creates regular user successfully                      | ✅     |
| Requires email address                                 | ✅     |
| Normalizes email before saving                         | ✅     |
| Hashes password correctly                              | ✅     |
| Saves extra fields correctly                           | ✅     |

## create_superuser()

| Test Case                                              | Status |
|--------------------------------------------------------|--------|
| Creates superuser successfully                         | ✅     |
| Sets is_staff=True                                     | ✅     |
| Sets is_superuser=True                                 | ✅     |
| Sets is_active=True                                    | ✅     |
| Raises ValueError when is_staff=False                  | ✅     |
| Raises ValueError when is_superuser=False              | ✅     |

## Email Uniqueness

| Test Case                                              | Status |
|--------------------------------------------------------|--------|
| Duplicate email raises IntegrityError                  | ✅     |

# Notes

```text
The CustomUserManager acts as the foundation for the project's
email-first authentication system.

The tests focus on validating:

- user creation behaviour
- superuser creation behaviour
- email normalization
- password hashing
- required authentication fields
- superuser permission safeguards
- unique email enforcement

The manager intentionally removes username-based authentication and
enforces email as the primary authentication identifier.

These tests validate the low-level business rules that support the
entire authentication system before API and serializer testing begins.
```
