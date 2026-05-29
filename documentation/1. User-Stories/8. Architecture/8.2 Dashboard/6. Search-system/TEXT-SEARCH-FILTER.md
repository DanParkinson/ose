# TextSearchFilter

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why TextSearchFilter Exists](#why-textsearchfilter-exists)
- [Responsibilities](#responsibilities)
- [What TextSearchFilter Does Not Do](#what-textsearchfilter-does-not-do)
- [Props](#props)
- [Controlled Component Behaviour](#controlled-component-behaviour)
- [Debounced Search Behaviour](#debounced-search-behaviour)
- [Search Triggering](#search-triggering)
- [Relationship With Dashboard State](#relationship-with-dashboard-state)
- [Relationship With useCoreModelData](#relationship-with-usecoremodeldata)
- [Usage Example](#usage-example)
- [Search Workflow](#search-workflow)

## Purpose

`TextSearchFilter` provides a reusable text search input for dashboard-style interfaces.

It allows users to search datasets while preventing excessive API requests through delayed search execution.

The component is intentionally generic and can be reused throughout the application.

## Why TextSearchFilter Exists

Without a reusable search component, every dashboard would need to implement:

```text
Input handling
Search delays
Search triggering
Search styling
```

individually.

`TextSearchFilter` centralises these behaviours into a single reusable component.

## Responsibilities

`TextSearchFilter` is responsible for:

```text
Rendering a search input
Managing user typing events
Triggering delayed searches
Providing consistent search styling
```

## What TextSearchFilter Does Not Do

`TextSearchFilter` does not:

```text
Store search state
Fetch data
Filter records
Perform API requests
Manage dashboard state
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
| `value` | Current search value |
| `onChange` | Updates input state |
| `onSearch` | Executes delayed search |
| `placeholder` | Input placeholder text |
| `delay` | Delay before search executes |

### Default Values

```js
placeholder = "Search..."
delay = 1000
```

## Controlled Component Behaviour

`TextSearchFilter` is a controlled component.

The current value comes from parent state.

Example:

```jsx
<TextSearchFilter
  value={searchInput}
  onChange={setSearchInput}
  onSearch={handleSearch}
/>
```

When the user types:

```js
onChange(event.target.value)
```

executes.

The component itself does not store the search value.

## Debounced Search Behaviour

The component delays search execution using:

```js
useEffect()
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

This creates debounce-style behaviour.

Every time the user types:

```text
Previous timer cleared
        ↓
New timer started
        ↓
Search delayed
```

The search only executes after typing stops.

## Search Triggering

After the configured delay:

```js
onSearch(value);
```

executes.

The component does not decide what happens next.

That decision belongs to the parent dashboard.

Examples:

```js
setSearchQuery(value);
```

or

```js
setSearchQuery(value);
setOffset(0);
```

## Relationship With Dashboard State

The dashboard typically owns:

```js
searchInput
searchQuery
```

Example:

```js
const [searchInput, setSearchInput] =
  useState("");

const [searchQuery, setSearchQuery] =
  useState("");
```

The search component updates:

```text
searchInput
```

Immediately.

After the delay it updates:

```text
searchQuery
```

through the dashboard callback.

This separation improves responsiveness and reduces unnecessary API requests.

## Relationship With useCoreModelData

Once:

```js
searchQuery
```

changes:

```js
useCoreModelData(
  endpoint,
  offset,
  searchQuery,
  activeFilters
);
```

detects the new value.

This triggers:

```text
Data reload
API request
Updated rows
Dashboard rerender
```

The search component never communicates directly with the API.

## Usage Example

```jsx
<TextSearchFilter
  value={searchInput}
  onChange={setSearchInput}
  onSearch={(value) => {
    setSearchQuery(value);
    setOffset(0);
  }}
  placeholder="Search subjects..."
/>
```

This workflow:

```text
Updates input immediately
Delays API searching
Resets pagination
Triggers new data loading
```

## Search Workflow

```text
User types into input
        ↓
onChange executes
        ↓
searchInput updates
        ↓
Debounce timer starts
        ↓
User stops typing
        ↓
onSearch executes
        ↓
searchQuery updates
        ↓
Pagination resets
        ↓
useCoreModelData reruns
        ↓
fetchCoreModelList executes
        ↓
API request sent
        ↓
Updated rows returned
        ↓
Dashboard table rerenders
```

## Key Architectural Principle

```text
TextSearchFilter captures search input.

Dashboard orchestration decides what to do with it.
```

This keeps search input behaviour reusable while allowing different parts of the application to control search workflows.