# useCoreModelData

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Hook Parameters](#hook-parameters)
- [Managed State](#managed-state)
- [Data Fetching](#data-fetching)
- [Automatic Refetching](#automatic-refetching)
- [Paginated Responses](#paginated-responses)
- [Manual Refetching](#manual-refetching)
- [Returned Values](#returned-values)
- [Frontend Relationship](#frontend-relationship)

## Purpose

`useCoreModelData` is a reusable frontend hook for loading model list data from the Core API.

The hook centralises:

```text
API fetching
Pagination state
Loading state
Error state
Search refetching
Filter refetching
```

This keeps dashboard pages and orchestration components simpler and more reusable.

## Hook Parameters

The hook currently accepts:

```js
useCoreModelData(
  endpoint,
  offset,
  searchQuery,
  activeFilters
)
```

| Parameter | Purpose |
|---|---|
| `endpoint` | API endpoint to request |
| `offset` | Current pagination offset |
| `searchQuery` | Current search value |
| `activeFilters` | Current filter object |

## Managed State

The hook manages:

| State | Purpose |
|---|---|
| `rows` | Returned model records |
| `count` | Total available records |
| `next` | Next page URL |
| `previous` | Previous page URL |
| `loading` | Current loading state |
| `error` | Request error state |

## Data Fetching

The hook fetches data using:

```js
fetchCoreModelList({
  endpoint,
  limit: 20,
  offset,
  searchQuery,
  filters: activeFilters,
});
```

The request is sent through the reusable Core API utility layer.

## Automatic Refetching

The hook automatically refetches data when dependencies change.

```js
[
  endpoint,
  offset,
  searchQuery,
  activeFilters
]
```

This keeps dashboard data synchronised with:

```text
Pagination changes
Search changes
Filter changes
Endpoint changes
```

## Paginated Responses

The hook supports paginated API responses.

```js
setRows(data.results || data);
```

If the response contains:

```text
results
```

the hook uses the paginated dataset.

Otherwise, the raw response array is used directly.

## Manual Refetching

The hook exposes a reusable refetch function.

```js
refetch: fetchRows
```

This allows orchestration components to manually reload data after operations such as:

```text
Create
Update
Delete
```

## Returned Values

The hook currently returns:

```js
{
  rows,
  count,
  next,
  previous,
  loading,
  error,
  refetch,
}
```

These values are consumed by dashboard tables, filters, pagination, and reusable form workflows.

## Frontend Relationship

`useCoreModelData` works together with:

```text
coreModels
Core API utilities
Dashboard tables
Pagination
Text search filters
Filter panels
```

The hook acts as the reusable frontend state layer between API requests and rendered dashboard data.