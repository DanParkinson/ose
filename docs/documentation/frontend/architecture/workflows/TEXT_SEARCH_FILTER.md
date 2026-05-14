# TEXT_SEARCH_FILTER

## Navigation

[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Table of Contents

- [Purpose](#purpose)

- [High Level Workflow Example](#high-level-workflow-example)
- [Step 1 — User Types Into Input](#step-1--user-types-into-input)
- [Step 2 — Input State Updates](#step-2--input-state-updates)
- [Step 3 — Delayed Search Execution](#step-3--delayed-search-execution)
- [Step 4 — Parent Search State Changes](#step-4--parent-search-state-changes)
- [Step 5 — useCoreModelData Detects Changes](#step-5--usecoremodeldata-detects-changes)
- [Step 6 — fetchRows Executes](#step-6--fetchrows-executes)
- [Step 7 — API Request Executes](#step-7--api-request-executes)
- [Step 8 — Response Updates Rows](#step-8--response-updates-rows)
- [Step 9 — DashboardTable Rerenders](#step-9--dashboardtable-rerenders)
- [Architecture Responsibilities](#architecture-responsibilities)
  - [TextSearchFilter](#textsearchfilter)
  - [Parent Orchestration Component](#parent-orchestration-component)
  - [useCoreModelData](#usecoremodeldata)
  - [fetchCoreModelList](#fetchcoremodellist)
  - [Backend API](#backend-api)

## Purpose

This document explains the orchestration workflow behind `TextSearchFilter` and how it connects to the application's data-fetching system.

The search filter itself does not fetch data.

Instead, it participates in a larger orchestration chain that:
- updates parent state
- triggers hooks
- refetches API data
- rerenders displayed results

# High Level Workflow example

```text
User types into TextSearchFilter
    ↓
Parent state updates
    ↓
useCoreModelData dependencies change
    ↓
useEffect refires
    ↓
fetchCoreModelList executes
    ↓
API request sent
    ↓
response data returned
    ↓
rows state updates
    ↓
DashboardTable rerenders
```

## Step 1 — User Types Into Input

`TextSearchFilter` is a controlled component.

The user types into the input:

```jsx
<TextSearchFilter
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={(value) => {
    setSearchQuery(value);
    setOffset(0);
  }}
/>
```

## Step 2 — Input State Updates

The component triggers:

```js
onChange(event.target.value)
```

This updates:

```js
searchQuery
```

inside the parent orchestration component.

## Step 3 — Delayed Search Execution

`TextSearchFilter` contains a delayed search workflow:

```js
useEffect(() => {
  const timeoutId = setTimeout(() => {
    onSearch(value);
  }, delay);

  return () => clearTimeout(timeoutId);
}, [value, onSearch, delay]);
```

This:
- waits for typing to stop
- prevents excessive API requests
- creates debounce-style behaviour

## Step 4 — Parent Search State Changes

After the delay:

```js
onSearch(value)
```

executes.

This updates parent state:

```js
setSearchQuery(value);
setOffset(0);
```

Important:
- pagination resets to page 1
- search state changes globally

## Step 5 — useCoreModelData Detects Changes

The updated state is passed into:

```js
useCoreModelData(
  selectedModel.endpoint,
  offset,
  searchQuery,
  activeFilters
)
```

Because `searchQuery` changed:
- hook dependencies change
- the hook reruns automatically

## Step 6 — fetchRows Executes

Inside `useCoreModelData`:

```js
useEffect(() => {
  fetchRows();
}, [fetchRows]);
```

This triggers:

```js
fetchCoreModelList({
  endpoint,
  limit: 20,
  offset,
  searchQuery,
  filters: activeFilters,
});
```

## Step 7 — API Request Executes

The API request becomes:

```text
GET /endpoint/?search=value
```

Example:

```text
GET /core/subjects/?search=math
```

The Django REST Framework backend handles:
- searching
- filtering
- pagination

## Step 8 — Response Updates Rows

The API response updates hook state:

```js
setRows(data.results || data);
```

This updates:
- rows
- count
- next
- previous

## Step 9 — DashboardTable Rerenders

Updated rows are passed into:

```jsx
<DashboardTable rows={rows} />
```

The table rerenders automatically with filtered results.

# Architecture Responsibilities

## TextSearchFilter

Responsible for:
- rendering input
- delayed search triggering

Not responsible for:
- fetching data
- filtering results
- managing API state

## Parent Orchestration Component

Responsible for:
- owning search state
- resetting pagination
- passing values into hooks

## useCoreModelData

Responsible for:
- detecting dependency changes
- triggering refetches
- managing API state

## fetchCoreModelList

Responsible for:
- constructing API params
- sending API requests

## Backend API

Responsible for:
- actual filtering/search logic
- returning filtered results
