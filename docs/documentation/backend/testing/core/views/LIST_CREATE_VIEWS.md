# List Create View overview

## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/backend/testing/TESTING_OVERVIEW.md)

## Legend

| Symbol | Meaning |
|---------|---------|
| ✅      | Test implemented |
| ❌      | Test not implemented |
| ➖      | Not required for this model |

## List - Permissions

| Test Case                             | Subject | Topic | Lesson Name | Variation | Teaching Style |
|---------------------------------------|---------|-------|-------------|-----------|----------------|
| Public users can access list endpoint | ✅      | ✅    | ✅          | ✅        | ✅             |

## List - Queryset / Returned Objects

| Test Case                                                | Subject | Topic | Lesson Name | Variation | Teaching Style |
|----------------------------------------------------------|---------|-------|-------------|-----------|----------------|
| Returns all expected objects                             | ✅      | ✅    | ✅          | ✅        | ✅             |
| Returns empty results list when queryset is empty        | ✅      | ✅    | ✅          | ✅        | ✅             |

## List - Response Structure

| Test Case                                      | Subject | Topic | Lesson Name | Variation | Teaching Style |
|------------------------------------------------|---------|-------|-------------|-----------|----------------|
| Returns paginated response structure           | ✅      | ✅    | ✅          | ✅        | ✅             |
| Returns expected serializer fields             | ✅      | ✅    | ✅          | ✅        | ✅             |
| Response structure is consistent across objects| ✅      | ✅    | ✅          | ✅        | ✅             |

## List - Response Values

| Test Case                                                  | Subject | Topic | Lesson Name | Variation | Teaching Style |
|------------------------------------------------------------|---------|-------|-------------|-----------|----------------|
| Returned titles match database records                     | ✅      | ✅    | ✅          | ✅        | ✅             |
| Returned values match stored database records              | ✅      | ✅    | ✅          | ✅        | ✅             |
| Returned nested relationship values match database records | ➖      | ✅    | ✅          | ➖        | ➖             |

## Create - Permissions

| Test Case                                                  | Subject | Topic | Lesson Name | Variation | Teaching Style |
|------------------------------------------------------------|---------|-------|-------------|-----------|----------------|
| Admin users can create object                              | ✅      | ✅    | ✅          | ✅        | ✅             |
| Authenticated non-admin users cannot create object         | ✅      | ✅    | ✅          | ✅        | ✅             |
| Unauthenticated users cannot create object                 | ✅      | ✅    | ✅          | ✅        | ✅             |

## Create - Valid Payloads

| Test Case                                      | Subject | Topic | Lesson Name | Variation | Teaching Style |
|------------------------------------------------|---------|-------|-------------|-----------|----------------|
| Valid payload creates object successfully      | ✅      | ✅    | ✅          | ✅        | ✅             |
| Valid payload assigns relationships correctly  | ➖      | ✅    | ✅          | ➖        | ➖             |
| Valid payload can assign multiple relationships| ➖      | ✅    | ✅          | ➖        | ➖             |
| Create response returns serialized object data | ➖      | ✅    | ✅          | ✅        | ✅             |

## Create - Invalid Payloads

| Test Case                                        | Subject | Topic | Lesson Name | Variation | Teaching Style |
|--------------------------------------------------|---------|-------|-------------|-----------|----------------|
| Duplicate object returns 400 BAD REQUEST         | ✅      | ✅    | ✅          | ✅        | ✅             |
| Missing required fields returns 400 BAD REQUEST  | ✅      | ✅    | ✅          | ✅        | ✅             |
| Invalid payload returns validation errors        | ✅      | ✅    | ✅          | ✅        | ✅             |
| Validation error attached to correct field       | ➖      | ✅    | ✅          | ✅        | ✅             |

## Create - Business Rules

| Test Case                              | Subject | Topic | Lesson Name | Variation | Teaching Style |
|----------------------------------------|---------|-------|-------------|-----------|----------------|
| Generated slug is created correctly    | ✅      | ❌    | ✅          | ✅        | ❌             |

# Notes

```text
The Subject API acts as the reference implementation for all core
ListCreateAPIView testing patterns across the project.

Topic and LessonName extend the base testing structure by validating
many-to-many subject relationships and nested serializer
representations.

Variation and TeachingStyle follow the simpler model structure because
they do not contain subject relationships or nested relationship data.

Most core models follow the same testing structure unless additional
business rules or relationships require specialised coverage.
```
