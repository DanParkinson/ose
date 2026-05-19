# List Create View Overview

## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/backend/testing/TESTING_OVERVIEW.md)

## Legend

| Symbol | Meaning |
|---------|---------|
| ✅      | Test implemented |
| ❌      | Test not implemented |
| ➖      | Not required for this model |

## List - Permissions

| Test Case                             | Subject |
|---------------------------------------|---------|
| Public users can access list endpoint | ✅      |

## List - Queryset / Returned Objects

| Test Case                                         | Subject |
|---------------------------------------------------|---------|
| Returns all expected objects                      | ✅      |
| Returns empty results list when queryset is empty | ✅      |

## List - Response Structure

| Test Case                                       | Subject |
|-------------------------------------------------|---------|
| Returns paginated response structure            | ✅      |
| Returns expected serializer fields              | ✅      |
| Response structure is consistent across objects | ✅      |

## List - Response Values

| Test Case                                     | Subject |
|-----------------------------------------------|---------|
| Returned titles match database records        | ✅      |
| Returned values match stored database records | ✅      |

## Create - Permissions

| Test Case                                          | Subject |
|----------------------------------------------------|---------|
| Admin users can create object                      | ✅      |
| Authenticated non-admin users cannot create object | ✅      |
| Unauthenticated users cannot create object         | ✅      |

## Create - Valid Payloads

| Test Case                                     | Subject |
|-----------------------------------------------|---------|
| Valid payload creates object successfully     | ✅      |

## Create - Invalid Payloads

| Test Case                                       | Subject |
|-------------------------------------------------|---------|
| Duplicate object returns 400 BAD REQUEST        | ✅      |
| Missing required fields returns 400 BAD REQUEST | ✅      |
| Invalid payload returns validation errors       | ✅      |

## Create - Business Rules

| Test Case                           | Subject |
|-------------------------------------|---------|
| Generated slug is created correctly | ✅      |

# Notes

```text
The Subject API acts as the reference implementation for all core
ListCreateAPIView testing patterns across the project.

Variation and TeachingStyle follow the simpler model structure because
they do not contain subject relationships or nested relationship data.

Most core models follow the same testing structure unless additional
business rules or relationships require specialised coverage.
```
