## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

## Relation Field Fetching

| Test Name | Purpose |
|---|---|
| fetches relation field options from the API | Verifies relation field options are requested from the API using the configured endpoint. |
| only relation fields trigger API requests | Verifies non-relation fields do not trigger relation option requests. |
| stores relation options using the field name | Verifies fetched relation data is stored using the relation field name as the key. |

## API Response Handling

| Test Name | Purpose |
|---|---|
| supports paginated API responses | Verifies paginated API responses using a `results` property are handled correctly. |
| supports non-paginated API responses | Verifies raw array API responses are handled correctly. |

## Error Handling

| Test Name | Purpose |
|---|---|
| returns empty array when relation request fails | Verifies failed relation requests return an empty array for the failed field. |
| logs error when relation request fails | Verifies relation request errors are logged to the console. |

## Dependency Updates

| Test Name | Purpose |
|---|---|
| refetches relation options when fields change | Verifies relation options refetch whenever the fields dependency changes. |
