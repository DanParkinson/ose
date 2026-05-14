## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

---

## Invalid Response Handling

| Test Name | Purpose |
|---|---|
| returns default errors when backend response is invalid | Verifies invalid backend response data returns the default fallback error structure. |
| returns default errors when backend response is missing | Verifies missing backend response data returns the default fallback error structure. |

## General Error Handling

| Test Name | Purpose |
|---|---|
| joins non_field_errors arrays into a single string | Verifies multiple non-field errors are combined into a single string. |
| returns non_field_errors strings directly | Verifies string-based non-field errors are returned unchanged. |
| uses detail as the general error when non_field_errors do not exist | Verifies `detail` values are used as the general error fallback. |

## Field Error Handling

| Test Name | Purpose |
|---|---|
| separates field errors from general errors | Verifies field-specific errors are separated from general backend errors correctly. |

## Empty State Handling

| Test Name | Purpose |
|---|---|
| returns empty errors when backend response is empty | Verifies empty backend error objects return empty field and general errors. |
