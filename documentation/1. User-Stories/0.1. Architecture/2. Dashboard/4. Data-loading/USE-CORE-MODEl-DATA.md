# useCoreModelData

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why useCoreModelData Exists](#why-usecoremodeldata-exists)
- [Hook Inputs](#hook-inputs)
- [Dashboard Relationship](#dashboard-relationship)
- [Returned Values](#returned-values)
- [Dependency-Based Refetching](#dependency-based-refetching)
- [Pagination Relationship](#pagination-relationship)
- [Search Relationship](#search-relationship)
- [Filter Relationship](#filter-relationship)
- [Manual Refetching](#manual-refetching)
- [Data Loading Workflow](#data-loading-workflow)

## Purpose

`useCoreModelData` is the reusable data-loading hook used by the dashboard system.

It loads model records from the active model endpoint and stores the response data needed by the dashboard.

## Why useCoreModelData Exists

The dashboard needs to load data based on changing state.

Examples:

```text
Selected model changes
Pagination changes
Search query changes
Filters change
Create/update/delete actions complete
```

Instead of placing this API state directly inside the dashboard component, `useCoreModelData` centralises the reusable data-loading logic.

## Hook Inputs

The dashboard passes these values into the hook:

```js
useCoreModelData(
  selectedModel.endpoint,
  offset,
  searchQuery,
  activeFilters
);
```

| Input | Purpose |
|---|---|
| `selectedModel.endpoint` | API endpoint to request |
| `offset` | Current pagination position |
| `searchQuery` | Active API search value |
| `activeFilters` | Current selected filter values |

## Dashboard Relationship

The dashboard owns the state that controls the request.

The hook receives that state and performs the loading workflow.

```text
Dashboard state
        ↓
useCoreModelData
        ↓
API request
        ↓
Rows returned
        ↓
Dashboard rerenders
```

The hook does not decide which model is active.

The dashboard passes the active endpoint into it.

## Returned Values

The hook returns the data needed by the dashboard.

```js
const {
  rows,
  next,
  previous,
  count,
  loading,
  refetch,
} = useCoreModelData(...);
```

| Value | Purpose |
|---|---|
| `rows` | Records displayed in the dashboard table |
| `next` | Next page URL from the backend |
| `previous` | Previous page URL from the backend |
| `count` | Total number of matching records |
| `loading` | Whether the request is currently loading |
| `refetch` | Manual reload function |

## Dependency-Based Refetching

The hook refetches data when its inputs change.

Typical triggers:

```text
Endpoint changes
Offset changes
Search query changes
Filter values change
```

This keeps dashboard data synchronised with dashboard state.

## Pagination Relationship

Pagination changes update:

```js
offset
```

The updated offset is passed into `useCoreModelData`.

This causes the hook to request a different page of results.

## Search Relationship

Search uses:

```js
searchQuery
```

not the live input value.

When the debounced search value changes, `searchQuery` updates and the hook refetches data.

## Filter Relationship

Filter changes update:

```js
activeFilters
```

The updated filter object is passed into the hook.

The hook then requests filtered data from the backend.

## Manual Refetching

The hook exposes:

```js
refetch
```

This is used after successful create, update, or delete actions.

Example:

```js
onCreated={() => {
  refetch();
}}
```

Manual refetching allows the dashboard to reload the latest data without changing search, filter, or pagination state.

## Data Loading Workflow

```text
Dashboard loads
        ↓
selectedModel endpoint passed into hook
        ↓
offset/search/filter state passed into hook
        ↓
useCoreModelData requests data
        ↓
Backend returns paginated response
        ↓
Hook stores rows/count/next/previous
        ↓
DashboardTable receives rows
        ↓
Pagination receives count/next/previous
        ↓
Dashboard renders updated data
```

`useCoreModelData` keeps API loading separate from dashboard layout and display components.