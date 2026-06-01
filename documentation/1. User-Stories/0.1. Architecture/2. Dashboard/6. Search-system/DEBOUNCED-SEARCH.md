# Debounced Search

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Debounced Search Exists](#why-debounced-search-exists)
- [The Problem Without Debouncing](#the-problem-without-debouncing)
- [How Debouncing Works](#how-debouncing-works)
- [TextSearchFilter Implementation](#textsearchfilter-implementation)
- [Relationship With searchInput](#relationship-with-searchinput)
- [Relationship With searchQuery](#relationship-with-searchquery)
- [Relationship With Data Loading](#relationship-with-data-loading)
- [Workflow](#workflow)

## Purpose

Debounced search delays the execution of a search until the user has stopped typing for a specified period of time.

The goal is to reduce unnecessary API requests while maintaining a responsive search experience.

## Why Debounced Search Exists

Users often type multiple characters in quick succession.

Example:

```text
mathematics
```

Without debouncing, each key press would trigger a new search request.

```text
m
ma
mat
math
mathe
mathem
...
```

This creates excessive API requests and unnecessary rerenders.

Debouncing waits for typing to pause before executing the search.

## The Problem Without Debouncing

Without debouncing:

```text
User types
        ↓
API request
        ↓
User types again
        ↓
API request
        ↓
User types again
        ↓
API request
```

Typing a ten-character word could easily generate:

```text
10 API requests
```

Most of these requests become obsolete before they complete.

## How Debouncing Works

Debouncing introduces a delay.

Example:

```text
1000ms
```

Every time the user types:

```text
Current timer cancelled
        ↓
New timer started
```

Only when typing stops for the full delay period does the search execute.

Example:

```text
User types
        ↓
Timer starts
        ↓
User types again
        ↓
Timer resets
        ↓
User stops typing
        ↓
Delay completes
        ↓
Search executes
```

## TextSearchFilter Implementation

The dashboard currently performs debouncing inside:

```js
TextSearchFilter
```

Implementation:

```js
useEffect(() => {
  const timeoutId = setTimeout(() => {
    onSearch(value);
  }, delay);

  return () => clearTimeout(timeoutId);
}, [value, onSearch, delay]);
```

This creates a delayed search workflow.

The previous timer is always cleared before a new timer starts.

## Relationship With searchInput

`searchInput` updates immediately.

Example:

```text
m
ma
mat
math
```

Every key press updates:

```js
searchInput
```

This keeps the input responsive.

## Relationship With searchQuery

`searchQuery` updates only after the debounce delay completes.

Example:

```text
searchInput
        ↓
debounce delay
        ↓
searchQuery
```

This means:

```text
Typing remains instant
Searching remains efficient
```

## Relationship With Data Loading

When the debounce delay completes:

```js
onSearch(value);
```

updates:

```js
searchQuery
```

This causes:

```text
useCoreModelData
        ↓
fetchCoreModelList
        ↓
API request
```

The debounce mechanism therefore sits between:

```text
User typing
```

and

```text
Backend searching
```

## Workflow

```text
User types into search field
        ↓
searchInput updates immediately
        ↓
Debounce timer starts
        ↓
User continues typing
        ↓
Previous timer cancelled
        ↓
New timer starts
        ↓
User stops typing
        ↓
Delay completes
        ↓
searchQuery updates
        ↓
useCoreModelData reruns
        ↓
fetchCoreModelList executes
        ↓
API request sent
        ↓
Updated results returned
        ↓
Dashboard rerenders
```

## Key Architectural Principle

```text
Debouncing delays searching, not typing.
```

The user receives immediate input feedback while the dashboard avoids unnecessary API requests.