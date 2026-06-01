# searchQuery

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why searchQuery Exists](#why-searchquery-exists)
- [Search State vs Input State](#search-state-vs-input-state)
- [Relationship With searchInput](#relationship-with-searchinput)
- [Relationship With useCoreModelData](#relationship-with-usecoremodeldata)
- [Relationship With fetchCoreModelList](#relationship-with-fetchcoremodellist)
- [Pagination Relationship](#pagination-relationship)
- [Example Implementation](#example-implementation)
- [Workflow](#workflow)

## Purpose

`searchQuery` stores the active search value used by the dashboard data loading system.

Unlike `searchInput`, which changes immediately while the user types, `searchQuery` only changes after the search delay has completed.

This makes `searchQuery` the value used when requesting filtered data from the backend.

## Why searchQuery Exists

The dashboard separates:

```text
User typing
```

from:

```text
Backend searching
```

Without this separation:

```text
Every key press
        ↓
API request
```

would occur.

Instead:

```text
User types
        ↓
searchInput updates
        ↓
Search delay completes
        ↓
searchQuery updates
        ↓
API request executes
```

This reduces unnecessary requests.

## Search State vs Input State

The dashboard normally stores:

```js
const [searchInput, setSearchInput] =
  useState("");

const [searchQuery, setSearchQuery] =
  useState("");
```

The two states serve different purposes.

| State | Purpose |
|---|---|
| `searchInput` | Live value currently being typed |
| `searchQuery` | Value currently used for API searching |

Although they often contain the same value, they do not update at the same time.

## Relationship With searchInput

`searchInput` eventually becomes `searchQuery`.

Example:

```js
onSearch={(value) => {
  setSearchQuery(value);
}}
```

Workflow:

```text
User types
        ↓
searchInput updates
        ↓
Search delay completes
        ↓
searchQuery updates
```

The dashboard intentionally keeps these states separate.

## Relationship With useCoreModelData

`searchQuery` is passed into:

```js
useCoreModelData(
  endpoint,
  offset,
  searchQuery,
  activeFilters
)
```

The hook watches for changes to:

```text
endpoint
offset
searchQuery
activeFilters
```

When `searchQuery` changes:

```text
Hook reruns
        ↓
Data reloads
```

This is the point where searching begins.

## Relationship With fetchCoreModelList

The hook passes `searchQuery` into:

```js
fetchCoreModelList({
  endpoint,
  offset,
  limit,
  searchQuery,
  filters,
});
```

The utility converts the search value into:

```text
?search=value
```

Example:

```text
GET /core/subjects/?search=math
```

The backend then performs the actual search.

## Pagination Relationship

Whenever a new search begins, pagination should return to the first page.

Example:

```js
onSearch={(value) => {
  setSearchQuery(value);
  setOffset(0);
}}
```

Without resetting pagination:

```text
User on page 4
        ↓
New search executes
        ↓
Page 4 requested
```

which can lead to confusing results.

Resetting pagination ensures searches always begin from the first page.

## Example Implementation

```js
const [searchInput, setSearchInput] =
  useState("");

const [searchQuery, setSearchQuery] =
  useState("");
```

Usage:

```jsx
<TextSearchFilter
  value={searchInput}
  onChange={setSearchInput}
  onSearch={(value) => {
    setSearchQuery(value);
    setOffset(0);
  }}
/>
```

Data loading:

```js
useCoreModelData(
  selectedModel.endpoint,
  offset,
  searchQuery,
  activeFilters
);
```

## Workflow

```text
User types into search input
        ↓
searchInput updates
        ↓
Search delay completes
        ↓
searchQuery updates
        ↓
Pagination resets
        ↓
useCoreModelData detects change
        ↓
fetchCoreModelList executes
        ↓
API request includes search parameter
        ↓
Filtered data returned
        ↓
Dashboard rerenders
```

## Key Architectural Principle

```text
searchInput stores what the user is typing.

searchQuery stores what the backend should search.
```

This separation improves performance, reduces API requests, and creates a smoother search experience.