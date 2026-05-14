## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

## useCoreModelData

| Test Name | Purpose |
|---|---|
| fetches paginated model data when endpoint is provided | Verifies paginated API responses correctly populate rows, count, next, and previous state values. |
| handles non-paginated API responses | Verifies non-paginated array responses are stored correctly when pagination metadata is not present. |
| does not fetch when endpoint is missing | Verifies no API request is made when the hook receives an empty endpoint value. |
| sets loading state while fetching | Verifies the loading state becomes true during requests and false after requests complete. |
| stores error when fetch fails | Verifies failed requests store the error object and stop the loading state. |
| refetch calls the API again | Verifies the returned refetch function manually triggers another API request. |
