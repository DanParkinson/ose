## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

## Field Option Fetching

| Test Name | Purpose |
|---|---|
| fetches field options when endpoint is provided | Verifies field options are requested from the API when a valid endpoint exists. |
| stores POST field options in state | Verifies POST field configuration returned from the API is stored in hook state. |
| returns empty object when endpoint does not exist | Verifies no request is made and the hook returns an empty object when no endpoint is provided. |

## Error Handling

| Test Name | Purpose |
|---|---|
| resets field options to empty object when request fails | Verifies field options reset to an empty object if the API request fails. |
| logs error when request fails | Verifies request errors are logged to the console when field option fetching fails. |

## Dependency Updates

| Test Name | Purpose |
|---|---|
| refetches field options when endpoint changes | Verifies field options are refetched whenever the endpoint dependency changes. |
