# Pagination Component

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Pagination Exists](#why-pagination-exists)
- [Responsibilities](#responsibilities)
- [What Pagination Does Not Do](#what-pagination-does-not-do)
- [Props](#props)
- [Pagination Label](#pagination-label)
- [Previous Button](#previous-button)
- [Next Button](#next-button)
- [Disabled Button Logic](#disabled-button-logic)
- [Relationship With Dashboard State](#relationship-with-dashboard-state)
- [Relationship With useCoreModelData](#relationship-with-usecoremodeldata)
- [Pagination Workflow](#pagination-workflow)

## Purpose

`Pagination` provides reusable previous and next navigation for paginated dashboard data.

It displays the current pagination state and triggers navigation callbacks provided by the parent dashboard.

## Why Pagination Exists

Dashboard list data is loaded in pages instead of loading every record at once.

Pagination allows users to move through the dataset while keeping API responses smaller and easier to manage.

## Responsibilities

`Pagination` is responsible for:

```text
Displaying pagination information
Rendering previous and next buttons
Disabling unavailable navigation buttons
Calling navigation handlers
Providing consistent pagination layout
```

## What Pagination Does Not Do

`Pagination` does not:

```text
Store offset state
Fetch data
Build API requests
Know which model is active
Apply search or filters
```

Those responsibilities belong to:

```text
Dashboard orchestration
useCoreModelData
fetchCoreModelList
Backend API
```

## Props

| Prop | Purpose |
|---|---|
| `previous` | Previous page URL from the API |
| `next` | Next page URL from the API |
| `offset` | Current pagination offset |
| `limit` | Number of records per page |
| `count` | Total number of matching records |
| `onPrevious` | Callback for previous page navigation |
| `onNext` | Callback for next page navigation |

Example:

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

## Pagination Label

The pagination label is rendered through:

```text
PaginationLabel
```

It receives:

```text
offset
limit
count
```

and displays the current result range.

Example:

```text
Showing 1-20 of 45
```

The label is display-only.

## Previous Button

The previous button triggers:

```js
onPrevious()
```

when clicked.

The parent dashboard decides how the offset should change.

Example parent behaviour:

```js
setOffset((prev) =>
  Math.max(prev - limit, 0)
);
```

## Next Button

The next button triggers:

```js
onNext()
```

when clicked.

The parent dashboard decides how the offset should change.

Example parent behaviour:

```js
setOffset((prev) => prev + limit);
```

## Disabled Button Logic

The previous button is disabled when:

```js
!previous || offset === 0
```

This prevents navigating before the first page.

The next button is disabled when:

```js
!next
```

This prevents navigating past the final page.

## Relationship With Dashboard State

The dashboard owns:

```js
offset
```

Pagination only receives the current offset and triggers callbacks.

When the dashboard updates `offset`, data loading reruns.

```text
Pagination click
        ↓
Dashboard offset state updates
        ↓
useCoreModelData reruns
```

## Relationship With useCoreModelData

`useCoreModelData` provides:

```text
next
previous
count
```

from the backend response.

The dashboard passes these values into `Pagination`.

The pagination component then uses them to display and disable navigation controls.

## Pagination Workflow

```text
Backend returns paginated response
        ↓
useCoreModelData stores next/previous/count
        ↓
Dashboard passes values into Pagination
        ↓
User clicks Next or Previous
        ↓
Pagination calls parent callback
        ↓
Dashboard updates offset
        ↓
useCoreModelData refetches data
        ↓
Dashboard table rerenders
```

## Key Architectural Principle

```text
Pagination displays navigation controls.

Dashboard state controls the current page.
```

This keeps the pagination component reusable and independent from API logic.