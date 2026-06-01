# Custom Register Serializer Test Overview

## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/backend/testing/TESTING_OVERVIEW.md)

## Legend

| Symbol | Meaning |
|---------|---------|
| ✅      | Test implemented |
| ❌      | Test not implemented |
| ➖      | Not required |

## validate_email()

| Test Case                                              | Status |
|--------------------------------------------------------|--------|
| Duplicate email raises ValidationError                 | ✅     |
| Unique email passes validation                         | ✅     |

# Notes

```text
The serializer tests focus only on custom serializer business logic.

The project intentionally avoids testing default DRF serializer
behaviour such as:

- serializer field generation
- serializer output structure
- built-in ModelSerializer functionality

The CustomRegisterSerializer contains one piece of custom logic:

- duplicate email validation

These tests ensure the registration system prevents duplicate
accounts from being created with the same email address.

The CustomUserDetailsSerializer does not currently contain custom
logic and therefore does not require dedicated serializer tests.
```
