# Searching

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Backend Search](#backend-search)
- [Frontend Search State](#frontend-search-state)
- [Search Query Parameters](#search-query-parameters)
- [Search Workflow](#search-workflow)
- [Frontend Relationship](#frontend-relationship)

## Purpose

Searching allows frontend requests to retrieve list results that match a text query.

The platform currently uses Django REST Framework search together with reusable frontend search state.

## Backend Search

Search is enabled using:

```py
filter_backends = [
    DjangoFilterBackend,
    filters.SearchFilter,
]
```

Searchable fields are declared using:

```py
search_fields = ["title"]
```

The backend applies text search when the request includes a `search` query parameter.

## Frontend Search State

The frontend separates the visible input value from the active API search value.

```js
const [searchInput, setSearchInput] = useState("");
const [searchQuery, setSearchQuery] = useState("");
```

This allows the input to update immediately while API requests use the delayed search value.

## Search Query Parameters

Search is sent through:

```js
fetchCoreModelList
```

Example request:

```text
/core/subjects/?search=math
```

The search value is added as:

```js
search: searchQuery || undefined
```

If no search value exists, the search parameter is omitted from the request.

## Search Workflow

```text
User types into search input
    ↓
searchInput updates immediately
    ↓
Debounced search updates searchQuery
    ↓
useCoreModelData dependencies change
    ↓
fetchCoreModelList executes
    ↓
API request sent with search parameter
    ↓
Backend searches configured fields
    ↓
Matching results returned
    ↓
Dashboard rerenders
```

## Frontend Relationship

Searching currently works together with:

```text
TextSearchFilter
fetchCoreModelList
useCoreModelData
Dashboard tables
Pagination
Filtering
```

Search and filter values can be combined in the same API request.