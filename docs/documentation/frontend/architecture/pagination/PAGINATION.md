# Pagination

## Navigation

[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Table of Contents

- [Purpose](#purpose)
- [Responsibilities](#responsibilities)
- [What It Does Not Do](#what-it-does-not-do)
- [Props](#props)
- [Navigation Behaviour](#navigation-behaviour)
- [Usage Example](#usage-example)
- [Example Workflow](#example-workflow)
- [Relationship With useCoreModelData](#relationship-with-usecoremodeldata)
- [Separation of Responsibilities](#separation-of-responsibilities)
  - [Parent Orchestration Component](#parent-orchestration-component)
  - [useCoreModelData](#usecoremodeldata)
- [Key Architectural Principle](#key-architectural-principle)

## Purpose

`Pagination` is a reusable pagination orchestration component used to navigate paginated datasets throughout the application.

It provides a consistent pagination interface for:
- dashboard tables
- resource listings
- paginated API datasets
- reusable data navigation workflows

The component coordinates:
- current page display
- previous/next navigation
- pagination state actions

while remaining presentation-focused.

## Responsibilities

`Pagination` is responsible for:

- displaying pagination information
- rendering previous/next navigation controls
- coordinating pagination layout
- disabling unavailable navigation actions
- maintaining consistent pagination styling across the application

## What It Does Not Do

`Pagination` does not:
- manage pagination state internally
- fetch data
- update offsets itself
- know anything about APIs or models
- calculate API responses

Those responsibilities belong to orchestration components/pages.

## Props

| Prop | Type  | Purpose |
|--------------|-------------|------------------------------------------------|
| `previous`   | string/null | Previous page API URL                          |
| `next`       | string/null | Next page API URL                              |
| `offset`     | number      | Current pagination offset                      |
| `limit`      | number      | Number of results per page                     |
| `count`      | number      | Total number of results                        |
| `onPrevious` | function    | Triggered when navigating to the previous page |
| `onNext`     | function    | Triggered when navigating to the next page     |

## Navigation Behaviour

The previous button becomes disabled when:

```js
!previous || offset === 0
```

The next button becomes disabled when:

```js
!next
```

This prevents invalid pagination navigation.

## Usage Example

```jsx
<Pagination
  previous={previous}
  next={next}
  offset={offset}
  limit={limit}
  count={count}
  onPrevious={() => {
    if (!previous || offset === 0) return;

    setOffset((prev) =>
      Math.max(prev - limit, 0)
    );
  }}
  onNext={() => {
    if (!next) return;

    setOffset((prev) => prev + limit);
  }}
/>
```

# Example Workflow

```text
User clicks Next
    ↓
onNext executes
    ↓
offset state updates
    ↓
useCoreModelData dependencies change
    ↓
API refetch executes
    ↓
new rows returned
    ↓
table rerenders
```

## Relationship With useCoreModelData

`Pagination` works together with:

```js
useCoreModelData
```

The hook provides:
- `previous`
- `next`
- `count`

The orchestration component provides:
- `offset`
- state update handlers

The pagination component only displays and triggers actions.

## Separation of Responsibilities

Responsible for:
- rendering navigation UI
- displaying pagination state
- triggering pagination actions

## Parent Orchestration Component

Responsible for:
- storing offset state
- updating offsets
- passing pagination data into hooks

## useCoreModelData

Responsible for:
- fetching paginated data
- storing count/next/previous state

# Key Architectural Principle

```text
Pagination displays navigation state.
Parent orchestration controls pagination state.
Hooks react to pagination changes.
API returns paginated datasets.
```
