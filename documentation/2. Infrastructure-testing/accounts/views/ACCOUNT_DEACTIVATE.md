# Account Deactivate View Test Overview

## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/backend/testing/TESTING_OVERVIEW.md)

## Legend

| Symbol | Meaning |
|---------|---------|
| ✅      | Test implemented |
| ❌      | Test not implemented |
| ➖      | Not required |

## Permissions

| Test Case                                              | Status |
|--------------------------------------------------------|--------|
| Authenticated users can deactivate account             | ✅     |
| Unauthenticated users cannot deactivate account        | ✅     |

## Response Structure

| Test Case                                              | Status |
|--------------------------------------------------------|--------|
| Returns expected success detail message                | ✅     |

## Business Rules

| Test Case                                              | Status |
|--------------------------------------------------------|--------|
| User is marked as inactive                             | ✅     |
| deactivated_at timestamp is set                        | ✅     |
| Access cookie is deleted                               | ✅     |
| Refresh cookie is deleted                              | ✅     |

# Notes

```text
The AccountDeactivateView supports account deactivation workflows
without permanently deleting user accounts.

The view requires authentication and performs a soft deactivation by:

- setting is_active=False
- storing a deactivated_at timestamp
- removing authentication cookies

The tests focus on validating:

- permissions
- response structure
- account lifecycle business rules
- authentication cleanup behaviour

The deactivation workflow intentionally preserves user records while
preventing future authentication until reactivation occurs.
```
