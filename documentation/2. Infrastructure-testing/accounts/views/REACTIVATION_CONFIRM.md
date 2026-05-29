# Reactivation Confirm View Test Overview

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
| Public users can confirm account reactivation          | ✅     |

## Response Structure

| Test Case                                              | Status |
|--------------------------------------------------------|--------|
| Valid reactivation returns success message             | ✅     |
| Invalid uid returns 400 BAD REQUEST                    | ✅     |
| Invalid token returns 400 BAD REQUEST                  | ✅     |
| Invalid uid returns expected error message             | ✅     |
| Invalid token returns expected error message           | ✅     |

## Business Rules

| Test Case                                              | Status |
|--------------------------------------------------------|--------|
| Valid uid and token reactivate inactive user           | ✅     |
| Valid reactivation sets is_active=True                 | ✅     |
| Valid reactivation clears deactivated_at               | ✅     |
| Invalid uid does not reactivate user                   | ✅     |
| Invalid token does not reactivate user                 | ✅     |
| Active users cannot be reactivated through inactive flow| ✅    |

# Notes

```text
The ReactivationConfirmView completes the account reactivation
workflow using a uid and token validation system.

The endpoint intentionally allows public access because users may need
to reactivate accounts before authentication is restored.

The tests focus on validating:

- token validation
- uid validation
- response structure
- account lifecycle behaviour
- inactive-user-only reactivation rules

The view only reactivates users when:

- the user exists
- the user is inactive
- the uid is valid
- the token is valid

Invalid or expired reactivation links intentionally fail with a
400 BAD REQUEST response.
```
