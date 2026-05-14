# Reactivation Request View Test Overview

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
| Public users can request account reactivation          | ✅     |

## Response Structure

| Test Case                                              | Status |
|--------------------------------------------------------|--------|
| Returns 200 OK for inactive email                      | ✅     |
| Returns 200 OK for unknown email                       | ✅     |
| Returns 200 OK for active user email                   | ✅     |
| Returns 200 OK when email is missing                   | ✅     |
| Returns expected generic detail message                | ✅     |

## Business Rules

| Test Case                                              | Status |
|--------------------------------------------------------|--------|
| Sends reactivation email for inactive user             | ✅     |
| Sends email to correct inactive user                   | ✅     |
| Email contains frontend reactivation URL               | ✅     |
| Does not send email for unknown email                  | ✅     |
| Does not send email for active user                    | ✅     |
| Does not send email when email is missing              | ✅     |
| Does not expose whether account exists                 | ✅     |

# Notes

```text
The ReactivationRequestView begins the account reactivation workflow.

The endpoint intentionally allows public access because users may need
to reactivate accounts while unauthenticated.

The view focuses on privacy-safe authentication behaviour by always
returning the same generic success response regardless of whether an
account exists.

The tests validate:

- public endpoint access
- response consistency
- email sending behaviour
- account enumeration protection
- inactive-user-only reactivation logic

The view only sends reactivation emails for users who:

- exist
- are inactive

All other cases intentionally fail silently to reduce security risks.
```
