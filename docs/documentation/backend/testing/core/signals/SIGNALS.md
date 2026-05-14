# Cache Invalidation Signal overview

## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/backend/testing/TESTING_OVERVIEW.md)

## Legend

| Symbol | Meaning |
|---------|---------|
| ✅      | Test implemented |
| ❌      | Test not implemented |
| ➖      | Not required for this model |

## Create - Cache Invalidation

| Test Case                                | Subject | Topic | Lesson Name | Variation | Teaching Style |
|------------------------------------------|---------|-------|-------------|-----------|----------------|
| Create clears list cache                 | ✅      | ✅    | ✅          | ✅        | ✅             |

## Update - Cache Invalidation

| Test Case                                | Subject | Topic | Lesson Name | Variation | Teaching Style |
|------------------------------------------|---------|-------|-------------|-----------|----------------|
| Update clears list cache                 | ✅      | ✅    | ✅          | ✅        | ✅             |

## Delete - Cache Invalidation

| Test Case                                | Subject | Topic | Lesson Name | Variation | Teaching Style |
|------------------------------------------|---------|-------|-------------|-----------|----------------|
| Delete clears list cache                 | ✅      | ✅    | ✅          | ✅        | ✅             |

# Notes

```text
Each core model implements cache invalidation through Django signals.

The cache invalidation pattern is intentionally consistent across all
core list endpoints to ensure predictable cache behaviour throughout
the API.

Signals currently invalidate list-level cache keys only.

Detail-level cache invalidation will be added if detail endpoint
caching is introduced in the future.
```
