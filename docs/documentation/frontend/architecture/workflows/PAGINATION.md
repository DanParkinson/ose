# PAGINATION

## Navigation

[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Table of Contents

- [Purpose](#purpose)

- [High Level Workflow](#high-level-workflow)
- [Step 1 — Pagination Receives State](#step-1--pagination-receives-state)
- [Step 2 — User Clicks a Pagination Button](#step-2--user-clicks-a-pagination-button)
- [Step 3 — Parent Updates Offset](#step-3--parent-updates-offset)
- [Step 4 — useCoreModelData Detects Offset Change](#step-4--usecoremodeldata-detects-offset-change)
- [Step 5 — fetchCoreModelList Sends Pagination Params](#step-5--fetchcoremodellist-sends-pagination-params)
- [Step 6 — Backend Returns Paginated Data](#step-6--backend-returns-paginated-data)
- [Step 7 — Hook Updates Pagination State](#step-7--hook-updates-pagination-state)
- [Step 8 — Pagination UI Updates](#step-8--pagination-ui-updates)
- [Disabled Button Logic](#disabled-button-logic)
- [Relationship With Search and Filters](#relationship-with-search-and-filters)

- [Architecture Responsibilities](#architecture-responsibilities)
  - [Pagination](#pagination)
  - [Parent Orchestration Component](#parent-orchestration-component)
  - [useCoreModelData](#usecoremodeldata)
  - [fetchCoreModelList](#fetchcoremodellist)
  - [Backend API](#backend-api)

- [Key Principle](#key-principle)

## Purpose

This document explains the orchestration workflow behind pagination and how it connects to the application's data-fetching system.

Pagination itself does not fetch data.

It updates pagination state in the parent component, which causes the data-fetching hook to request a different page of results.

## High Level Workflow

```text
User clicks Previous or Next
    ↓
Pagination calls onPrevious or onNext
    ↓
Parent updates offset state
    ↓
useCoreModelData dependencies change
    ↓
fetchCoreModelList sends updated pagination params
    ↓
API returns the requested page
    ↓
rows, count, next, and previous update
    ↓
Table rerenders
```

## Step 1 — Pagination Receives State

The parent component passes pagination values into `Pagination`.

```jsx
<Pagination
  previous={previous}
  next={next}
  offset={offset}
  limit={limit}
  count={count}
  onPrevious={handlePrevious}
  onNext={handleNext}
/>
```

These values usually come from:

```js
useCoreModelData(...)
```

## Step 2 — User Clicks a Pagination Button

When the user clicks `Next`, this runs:

```js
onNext()
```

When the user clicks `Previous`, this runs:

```js
onPrevious()
```

`Pagination` does not decide how the offset changes. It only triggers the handlers passed from the parent.

## Step 3 — Parent Updates Offset

The parent component owns the `offset` state.

Example:

```js
const [offset, setOffset] = useState(0);
```

Next page:

```js
setOffset((prev) => prev + limit);
```

Previous page:

```js
setOffset((prev) => Math.max(prev - limit, 0));
```

## Step 4 — useCoreModelData Detects Offset Change

The updated `offset` is passed into:

```js
useCoreModelData(
  selectedModel.endpoint,
  offset,
  searchQuery,
  activeFilters
)
```

Because `offset` changed, the hook refetches data.

## Step 5 — fetchCoreModelList Sends Pagination Params

Inside `useCoreModelData`, the hook calls:

```js
fetchCoreModelList({
  endpoint,
  limit: 20,
  offset,
  searchQuery,
  filters: activeFilters,
});
```

The API request includes:

```text
?limit=20&offset=20
```

Example:

```text
GET /core/subjects/?limit=20&offset=20
```

## Step 6 — Backend Returns Paginated Data

The backend returns pagination metadata:

```json
{
  "count": 45,
  "next": "http://localhost:8000/core/subjects/?limit=20&offset=40",
  "previous": "http://localhost:8000/core/subjects/?limit=20&offset=0",
  "results": []
}
```

## Step 7 — Hook Updates Pagination State

`useCoreModelData` stores the returned values:

```js
setRows(data.results || data);
setCount(data.count || 0);
setNext(data.next || null);
setPrevious(data.previous || null);
```

These values are passed back into `Pagination`.

## Step 8 — Pagination UI Updates

`Pagination` updates automatically because its props changed.

Examples:
- if `next` is `null`, the Next button disables
- if `previous` is `null`, the Previous button disables
- the page label updates from the new `offset`
- the result count remains visible

## Disabled Button Logic

Previous is disabled when:

```js
!previous || offset === 0
```

Next is disabled when:

```js
!next
```

This prevents invalid pagination navigation.

## Relationship With Search and Filters

Search and filters reset pagination back to the first page.

Example:

```js
setOffset(0);
```

This prevents the UI from staying on an offset that may not exist after the results change.

# Architecture Responsibilities

## Pagination

Responsible for:
- displaying page information
- displaying previous/next buttons
- triggering navigation handlers
- disabling unavailable navigation buttons

Not responsible for:
- storing offset state
- fetching data
- building API query params

## Parent Orchestration Component

Responsible for:
- storing `offset`
- updating `offset`
- passing `offset` into `useCoreModelData`
- resetting offset when search/filter state changes

## useCoreModelData

Responsible for:
- refetching when `offset` changes
- storing returned pagination data
- exposing `count`, `next`, and `previous`

## fetchCoreModelList

Responsible for:
- sending `limit`
- sending `offset`
- combining pagination with search/filter params

## Backend API

Responsible for:
- applying pagination
- returning `count`
- returning `next`
- returning `previous`
- returning `results`

# Key Principle

```text
Pagination triggers offset changes.
Offset changes trigger data refetching.
The backend returns page metadata.
The UI updates from returned metadata.
```
