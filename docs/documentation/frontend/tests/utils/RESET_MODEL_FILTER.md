## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

---

## Filter Reset Generation

| Test Name | Purpose |
|---|---|
| filter keys default to "all" | Verifies filter keys initialise with the default reset value of `"all"`. |
| multiple filters are reset correctly | Verifies multiple filters are converted into reset filter values correctly. |
| filters preserve their original keys | Verifies original filter keys are preserved in the generated reset object. |

## Empty State Handling

| Test Name | Purpose |
|---|---|
| empty filter arrays return empty objects | Verifies empty filter arrays return an empty object. |
| undefined filters return empty objects | Verifies undefined filters return an empty object. |
