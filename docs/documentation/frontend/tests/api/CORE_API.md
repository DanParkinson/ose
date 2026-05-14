## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

## fetchCoreModelList

| Test Name | Purpose |
|---|---|
| fetches a core model list using default params | Verifies default limit, offset, and search params are applied correctly. |
| fetches a core model list with custom pagination params | Verifies custom limit and offset values are sent correctly. |
| fetches a core model list with a search query | Verifies search queries are included in request params. |
| fetches a core model list with active filters | Verifies active filters are added to request params. |
| ignores filters with a value of "all" | Verifies filters set to `"all"` are excluded from request params. |

## fetchCoreModelOptions

| Test Name | Purpose |
|---|---|
| fetches core model options from the given endpoint | Verifies OPTIONS requests are sent correctly and response data is returned. |

## createCoreModelItem

| Test Name | Purpose |
|---|---|
| creates a core model item using the given endpoint and data | Verifies POST requests are sent correctly with payload data. |
