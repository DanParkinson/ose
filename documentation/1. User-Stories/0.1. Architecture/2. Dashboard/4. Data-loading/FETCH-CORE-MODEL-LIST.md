# fetchCoreModelList

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why fetchCoreModelList Exists](#why-fetchcoremodellist-exists)
- [Relationship With useCoreModelData](#relationship-with-usecoremodeldata)
- [Function Inputs](#function-inputs)
- [Request Parameter Construction](#request-parameter-construction)
- [Search Parameter Handling](#search-parameter-handling)
- [Filter Parameter Handling](#filter-parameter-handling)
- [API Request Execution](#api-request-execution)
- [Response Handling](#response-handling)
- [Example Request](#example-request)
- [Data Loading Workflow](#data-loading-workflow)

## Purpose

`fetchCoreModelList` is the reusable API utility responsible for requesting model list data from the backend.

It acts as the bridge between:

```text
Dashboard state
API requests
Backend list endpoints
```

The dashboard does not communicate with Axios directly.

Instead, dashboard data loading flows through `fetchCoreModelList`.

## Why fetchCoreModelList Exists

Without a shared API utility, every dashboard feature would need to manually construct:

```text
Pagination parameters
Search parameters
Filter parameters
Axios requests
```

This would create duplicated API logic across the application.

`fetchCoreModelList` centralises the list-loading workflow into a single reusable utility.

## Relationship With useCoreModelData

`fetchCoreModelList` is called by:

```js
useCoreModelData()
```

The hook manages:

```text
Loading state
Rows state
Count state
Pagination state
```

The API utility manages:

```text
Parameter construction
API requests
Response retrieval
```

This keeps responsibilities separated.

## Function Inputs

```js
fetchCoreModelList({
  endpoint,
  limit,
  offset,
  searchQuery,
  filters,
});
```

| Input | Purpose |
|---|---|
| `endpoint` | API endpoint to request |
| `limit` | Number of results per page |
| `offset` | Pagination offset |
| `searchQuery` | Current search value |
| `filters` | Active dashboard filters |

## Request Parameter Construction

The utility begins by building the request parameters.

```js
const params = {
  limit,
  offset,
  search: searchQuery || undefined,
};
```

This creates a parameter object that can be passed directly into Axios.

The resulting request may become:

```text
GET /core/subjects/?limit=20&offset=0
```

or

```text
GET /core/subjects/?limit=20&offset=20
```

depending on dashboard state.

## Search Parameter Handling

Search values are only included when a search exists.

```js
search: searchQuery || undefined
```

Examples:

```js
searchQuery = ""
```

becomes:

```text
No search parameter sent
```

while:

```js
searchQuery = "math"
```

becomes:

```text
?search=math
```

This keeps API requests clean when search is not being used.

## Filter Parameter Handling

Filter values are added dynamically.

```js
Object.entries(filters).forEach(
  ([key, value]) => {
    if (value !== "all") {
      params[key] = value;
    }
  }
);
```

The special value:

```js
"all"
```

represents:

```text
No filtering
```

and is intentionally excluded from API requests.

Example:

```js
{
  level: "secondary",
  is_published: true,
}
```

becomes:

```text
?level=secondary&is_published=true
```

## API Request Execution

Once the parameters are prepared, the request is sent.

```js
const response =
  await axiosResponse.get(
    endpoint,
    { params }
  );
```

The utility uses:

```js
axiosResponse
```

which provides:

```text
Shared Axios configuration
Credential support
Token refresh handling
```

## Response Handling

The utility returns:

```js
response.data
```

directly.

```js
return response.data;
```

It does not:

```text
Store state
Transform data
Manage loading
Manage errors
```

Those responsibilities belong to higher-level hooks.

## Example Request

Input:

```js
fetchCoreModelList({
  endpoint: "/core/subjects/",
  limit: 20,
  offset: 0,
  searchQuery: "math",
  filters: {
    level: "secondary",
    is_published: true,
  },
});
```

Generated request:

```text
GET /core/subjects/
    ?limit=20
    &offset=0
    &search=math
    &level=secondary
    &is_published=true
```

## Data Loading Workflow

```text
Dashboard state changes
        ↓
useCoreModelData reruns
        ↓
fetchCoreModelList called
        ↓
Request parameters built
        ↓
Search parameter added
        ↓
Filter parameters added
        ↓
Axios request sent
        ↓
Backend returns response
        ↓
Response returned to hook
        ↓
Hook updates dashboard state
        ↓
Dashboard rerenders
```

## Key Architectural Principle

```text
Dashboard state decides WHAT to request.

fetchCoreModelList decides HOW to request it.
```

This keeps API communication reusable and separate from dashboard orchestration.