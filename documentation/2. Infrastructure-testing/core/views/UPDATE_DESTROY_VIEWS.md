# Detail View Overview

## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/backend/testing/TESTING_OVERVIEW.md)

## Legend

| Symbol | Meaning |
|---------|---------|
| ✅      | Test implemented |
| ❌      | Test not implemented |
| ➖      | Not required for this model |

## Retrieve - Permissions

| Test Case                                         | Subject |
|---------------------------------------------------|---------|
| Admin users can retrieve object detail            | ✅      |
| Authenticated non-admin users cannot retrieve object detail | ✅ |
| Unauthenticated users cannot retrieve object detail | ✅    |

## Retrieve - Response Values

| Test Case                                           | Subject |
|-----------------------------------------------------|---------|
| Returned object detail matches database record      | ✅      |

## Update - Permissions

| Test Case                                          | Subject |
|----------------------------------------------------|---------|
| Admin users can update object                      | ✅      |
| Authenticated non-admin users cannot update object | ✅      |
| Unauthenticated users cannot update object         | ✅      |

## Update - Protected Logic

| Test Case                                                   | Subject |
|-------------------------------------------------------------|---------|
| Protected objects cannot be updated                         | ✅      |
| Non-protected objects can be updated                        | ✅      |
| Protected update attempts return 403 FORBIDDEN              | ✅      |
| Protected objects remain unchanged after failed update      | ✅      |

## Delete - Permissions

| Test Case                                          | Subject |
|----------------------------------------------------|---------|
| Admin users can delete object                      | ✅      |
| Authenticated non-admin users cannot delete object | ✅      |
| Unauthenticated users cannot delete object         | ✅      |

## Delete - Protected Logic

| Test Case                                                   | Subject |
|-------------------------------------------------------------|---------|
| Protected objects cannot be deleted                         | ✅      |
| Non-protected objects can be deleted                        | ✅      |
| Protected delete attempts return 403 FORBIDDEN              | ✅      |
| Protected objects remain in database after failed delete    | ✅      |

## Not Found

| Test Case                                      | Subject |
|------------------------------------------------|---------|
| Deleted or invalid object returns 404 NOT FOUND| ✅      |

# Notes

```text
The Subject Detail API validates retrieve, update, and delete
behaviour for protected and non-protected objects.

Detail endpoints are intentionally restricted to admin users only.

Protected object logic prevents accidental modification or deletion of
core system records.

The detail view tests validate:

- permission enforcement
- returned serializer values
- update behaviour
- delete behaviour
- protected object business rules
- 404 handling for deleted objects

Most protected object behaviour is implemented consistently across
core admin-managed models.
```
