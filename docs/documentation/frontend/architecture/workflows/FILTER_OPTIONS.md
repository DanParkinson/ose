# FILTER_OPTIONS

## Navigation

[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Table of Contents

- [Purpose](#purpose)

- [High Level Workflow](#high-level-workflow)
- [Step 1 — Filter Options Are Generated](#step-1--filter-options-are-generated)
- [Step 2 — Active Option Is Detected](#step-2--active-option-is-detected)
- [Step 3 — User Clicks an Option](#step-3--user-clicks-an-option)
- [Step 4 — Parent Updates Filter State](#step-4--parent-updates-filter-state)
- [Step 5 — Pagination Resets](#step-5--pagination-resets)
- [Step 6 — useCoreModelData Refetches](#step-6--usecoremodeldata-refetches)
- [Step 7 — API Params Are Built](#step-7--api-params-are-built)
- [Step 8 — Backend Returns Filtered Results](#step-8--backend-returns-filtered-results)
- [Step 9 — UI Rerenders](#step-9--ui-rerenders)

- [Architecture Responsibilities](#architecture-responsibilities)
  - [FilterOptions](#filteroptions)
  - [Parent Orchestration Component](#parent-orchestration-component)
  - [useCoreModelData](#usecoremodeldata)
  - [fetchCoreModelList](#fetchcoremodellist)
  - [Backend API](#backend-api)

## Purpose

This document explains the orchestration workflow behind `FilterOptions` and how selected filter options connect to the application’s data-fetching system.

`FilterOptions` does not apply filters itself.

It sends the selected filter value back to the parent component, where the filter state is updated and the API request is refired.

## High Level Workflow

```text
User clicks a filter option
    ↓
FilterOptions calls onFilterChange
    ↓
Parent updates activeFilters
    ↓
Pagination resets to page 1
    ↓
useCoreModelData dependencies change
    ↓
fetchCoreModelList sends updated query params
    ↓
API returns filtered data
    ↓
rows state updates
    ↓
Table rerenders
```

## Step 1 — Filter Options Are Generated

`FilterOptions` receives a filter group from a parent component.

Example:

```jsx
<FilterOptions
  filterKey="level"
  options={[
    { label: "All", value: "all" },
    { label: "Primary", value: "primary" },
    { label: "Secondary", value: "secondary" },
  ]}
  activeFilters={activeFilters}
  onFilterChange={handleFilterChange}
/>
```

The component loops through `options` and renders each one as a clickable radio-style item.

## Step 2 — Active Option Is Detected

The active value is read from the parent state:

```js
const activeValue = activeFilters[filterKey] ?? "all";
```

If no value exists yet, it defaults to:

```js
"all"
```

This keeps the default filter visually active.

## Step 3 — User Clicks an Option

When the user clicks an option:

```js
onFilterChange(filterKey, option.value)
```

runs.

Example:

```js
onFilterChange("level", "secondary")
```

## Step 4 — Parent Updates Filter State

The parent component updates `activeFilters`.

Example:

```js
setActiveFilters((prev) => ({
  ...prev,
  [filterKey]: value,
}));
```

Result:

```js
{
  level: "secondary"
}
```

## Step 5 — Pagination Resets

The parent also resets pagination:

```js
setOffset(0);
```

This ensures filtered results start from page 1.

## Step 6 — useCoreModelData Refetches

The updated filter state is passed into:

```js
useCoreModelData(
  selectedModel.endpoint,
  offset,
  searchQuery,
  activeFilters
)
```

Because `activeFilters` changed, the hook refetches data.

## Step 7 — API Params Are Built

`fetchCoreModelList` receives the updated filters:

```js
fetchCoreModelList({
  endpoint,
  limit: 20,
  offset,
  searchQuery,
  filters: activeFilters,
});
```

It excludes filters set to `"all"`.

Example:

```js
{
  level: "secondary",
  is_published: "all"
}
```

becomes:

```text
?level=secondary
```

## Step 8 — Backend Returns Filtered Results

The backend receives the query params and returns matching data.

Example request:

```text
GET /core/subjects/?level=secondary
```

# Step 9 — UI Rerenders

The returned data updates:

```js
rows
count
next
previous
```

Then the table rerenders with the filtered results.

# Architecture Responsibilities

## FilterOptions

Responsible for:
- displaying options
- showing active state
- reporting selected values

Not responsible for:
- storing filter state
- making API requests
- resetting pagination
- applying filters directly

## Parent Orchestration Component

Responsible for:
- owning `activeFilters`
- updating selected filter values
- resetting pagination
- passing filters into hooks

## useCoreModelData

Responsible for:
- detecting changed dependencies
- refetching data
- storing returned results

## fetchCoreModelList

Responsible for:
- converting filter state into query params
- excluding `"all"` values
- sending the API request

## Backend API

Responsible for:
- applying filter logic
- returning filtered records
