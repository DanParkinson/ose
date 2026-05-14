## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

---

## Empty Search Handling

| Test Name | Purpose |
|---|---|
| returns empty array when search value is empty | Verifies empty search values return an empty result set. |
| returns empty array when search value contains only whitespace | Verifies whitespace-only search values return an empty result set. |

## Option Filtering

| Test Name | Purpose |
|---|---|
| returns matching options | Verifies matching relation options are returned correctly. |
| excludes non-matching options | Verifies non-matching relation options are excluded from the results. |
| returns multiple matching options | Verifies multiple matching relation options are returned correctly. |

## Search Behaviour

| Test Name | Purpose |
|---|---|
| searches are case-insensitive | Verifies filtering ignores casing differences during matching. |

## formatOption Integration

| Test Name | Purpose |
|---|---|
| calls formatOption correctly | Verifies formatOption receives the correct option and field arguments during filtering. |
