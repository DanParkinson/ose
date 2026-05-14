## Empty State Handling

| Test Name | Purpose |
|---|---|
| returns null when field has no error | Verifies null is returned when the requested field does not exist in the error object. |
| returns null when field error is undefined | Verifies null is returned when the field error value is undefined. |

## String Error Handling

| Test Name | Purpose |
|---|---|
| returns string errors unchanged | Verifies string-based field errors are returned without modification. |

## Array Error Handling

| Test Name | Purpose |
|---|---|
| joins array errors into a single string | Verifies array-based field errors are combined into a single space-separated string. |
| returns empty string when error array is empty | Verifies empty error arrays return an empty string. |
