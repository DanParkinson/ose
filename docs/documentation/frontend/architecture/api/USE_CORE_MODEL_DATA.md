# useCoreModelData

## Navigation

[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Table of Contents

- [File](#file)
- [Parameters](#parameters)
- [State Managed](#state-managed)
- [Data Fetching](#data-fetching)
- [Paginated and Non-Paginated Responses](#paginated-and-non-paginated-responses)
- [Automatic Refetching](#automatic-refetching)
- [Manual Refetching](#manual-refetching)
- [Returned Values](#returned-values)
- [Example Usage](#example-usage)
- [Design Goals](#design-goals)
- [Usage Rules](#usage-rules)

`useCoreModelData` is a reusable hook for loading model data from the Core API.

It manages:

- fetched rows
- total result count
- pagination links
- loading state
- error state
- manual refetching

## File

| File | Description |
|---|---|
| `useCoreModelData.js` | Reusable data-fetching hook for model list endpoints |

## Parameters

```js
useCoreModelData(
  endpoint,
  offset,
  searchQuery,
  activeFilters
)
```

| Parameter | Description |
|---|---|
| `endpoint` | API endpoint to fetch data from |
| `offset` | Current pagination offset |
| `searchQuery` | Current search value |
| `activeFilters` | Current active filter object |

## State Managed

| State | Description |
|---|---|
| `rows` | Stores returned model records |
| `count` | Stores total number of available records |
| `next` | Stores the next page URL from the API |
| `previous` | Stores the previous page URL from the API |
| `loading` | Tracks whether data is currently being fetched |
| `error` | Stores request errors |

## Data Fetching

The hook uses `fetchCoreModelList` to request data.

```js
const data = await fetchCoreModelList({
  endpoint,
  limit: 20,
  offset,
  searchQuery,
  filters: activeFilters,
});
```

The limit is currently fixed at `20`.

## Paginated and Non-Paginated Responses

The hook supports both paginated and non-paginated API responses.

```js
setRows(data.results || data);
```

If the response contains `results`, it uses that.

If the response is a plain array, it uses the response directly.

## Automatic Refetching

The hook automatically refetches data when any of these values change:

```js
[
  endpoint,
  offset,
  searchQuery,
  activeFilters
]
```

This keeps the displayed data synchronised with the current endpoint, pagination, search, and filter state.

## Manual Refetching

The hook also returns a `refetch` function.

```js
refetch: fetchRows
```

This allows parent components to manually reload data after actions such as creating a new item.

## Returned Values

| Value | Description |
|---|---|
| `rows` | Model records returned from the API |
| `count` | Total number of records |
| `next` | Next page URL |
| `previous` | Previous page URL |
| `loading` | Loading status |
| `error` | Request error |
| `refetch` | Function used to manually reload data |

## Example Usage

```js
const {
  rows,
  count,
  next,
  previous,
  loading,
  error,
  refetch,
} = useCoreModelData(
  selectedModel.endpoint,
  offset,
  searchQuery,
  activeFilters
);
```

## Design Goals

| Goal | Description |
|---|---|
| Reusability | Can fetch data for any compatible model endpoint |
| Separation of concerns | Keeps API state outside page components |
| Pagination support | Stores count, next, and previous data |
| Search support | Refetches when search changes |
| Filter support | Refetches when filters change |
| Manual reloads | Supports refetching after create/update actions |

## Usage Rules

- Use this hook when a component needs reusable model list data.
- Pass the endpoint from the model configuration.
- Reset `offset` before changing search or filters.
- Use `refetch` after creating or updating data.
- Keep direct API fetching out of dashboard page components where possible.
