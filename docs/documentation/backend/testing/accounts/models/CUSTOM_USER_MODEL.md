# Custom User Model Test Overview

## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/backend/testing/TESTING_OVERVIEW.md)

## Legend

| Symbol | Meaning |
|---------|---------|
| ✅      | Test implemented |
| ❌      | Test not implemented |
| ➖      | Not required |

## Field Configuration

| Test Case                                              | Status |
|--------------------------------------------------------|--------|
| Username field is removed                              | ✅     |
| Email field stores user email correctly                | ✅     |
| Email field is unique                                  | ✅     |
| deactivated_at allows null values                      | ✅     |
| deactivated_at allows blank values                     | ✅     |

## Authentication Configuration

| Test Case                                              | Status |
|--------------------------------------------------------|--------|
| USERNAME_FIELD is set to email                         | ✅     |
| REQUIRED_FIELDS is empty                               | ✅     |

## String Representation

| Test Case                                              | Status |
|--------------------------------------------------------|--------|
| __str__ returns the user's email address               | ✅     |

# Notes

```text
The CustomUser model acts as the core authentication model for the
platform.

The tests validate the structural configuration of the model rather
than the behaviour of the custom user manager.

The model intentionally removes username-based authentication and
uses email as the primary authentication identifier.

These tests focus on validating:

- field configuration
- authentication configuration
- email uniqueness
- account deactivation support
- model string representation

The deactivated_at field supports soft account deactivation workflows
without permanently deleting user accounts.

Authentication-specific behaviour such as user creation, password
hashing, and superuser validation is covered separately in the
CustomUserManager tests.
```
