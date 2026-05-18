# TextSearchFilter

## Navigation

[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Table of Contents

- [Purpose](#purpose)
- [Responsibilities](#responsibilities)
- [What It Does Not Do](#what-it-does-not-do)
- [Props](#props)
- [Default Props](#default-props)
- [How Debounced Search Should Be Set Up](#how-debounced-search-should-be-set-up)
- [Why Two Pieces of State Are Needed](#why-two-pieces-of-state-are-needed)
- [How The Component And Parent Work Together](#how-the-component-and-parent-work-together)
- [Correct Usage Example](#correct-usage-example)
- [Incorrect Usage Example](#incorrect-usage-example)
- [Example Workflow](#example-workflow)
- [Controlled Component Behaviour](#controlled-component-behaviour)
- [Resetting Search](#resetting-search)
- [Key Rule](#key-rule)

## Purpose

`TextSearchFilter` is a reusable text-based search input component used to filter data dynamically throughout the application.

It provides a consistent search experience for:

- dashboard filtering
- resource searching
- model searching
- dynamic list filtering

The component includes built-in delayed search execution to reduce unnecessary requests and improve performance.

## Responsibilities

`TextSearchFilter` is responsible for:

- rendering a themed search input
- displaying the current controlled input value
- updating the parent input state when the user types
- waiting before running the search action
- cancelling unfinished timers while the user continues typing
- maintaining consistent search styling across the application

## What It Does Not Do

`TextSearchFilter` does not:

- store search state internally
- fetch data itself
- filter datasets directly
- manage pagination
- know anything about APIs or models
- decide when data should be refetched

Those responsibilities belong to orchestration components/pages.

## Props

| Prop | Type | Purpose |
|---|---|---|
| `value` | string | Current visible input value |
| `onChange` | function | Updates the immediate input state |
| `onSearch` | function | Executes the delayed search action |
| `placeholder` | string | Placeholder text displayed inside the input |
| `delay` | number | Delay time before triggering search execution |

## Default Props

| Prop | Default |
|---|---|
| `placeholder` | `"Search..."` |
| `delay` | `1000` |

## How Debounced Search Should Be Set Up

Debounced search should use two separate pieces of state in the parent component:

```jsx
const [searchInput, setSearchInput] = useState("");
const [searchQuery, setSearchQuery] = useState("");
```

These two states have different jobs.

`searchInput` controls what the user sees while typing.

`searchQuery` controls the actual API request.

This separation is important because the API hook should listen to `searchQuery`, not the raw input value.

## Why Two Pieces of State Are Needed

If the same state is used for both the input value and the API query, the API request fires every time a letter is typed.

That happens because the parent state updates immediately on each keypress.

Correct setup:

```text
searchInput = immediate typing state
searchQuery = delayed API search state
```

This allows the input to update instantly while the API waits until the user stops typing.

## How The Component And Parent Work Together

The `TextSearchFilter` component handles the delayed search behaviour.

```jsx
import { Box, Input } from "@chakra-ui/react";
import { useEffect } from "react";

const TextSearchFilter = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  delay = 1000,
}) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(value);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, onSearch, delay]);

  return (
    <Box>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </Box>
  );
};

export default TextSearchFilter;
```

The parent component owns the state.

```jsx
const [searchInput, setSearchInput] = useState("");
const [searchQuery, setSearchQuery] = useState("");
const [offset, setOffset] = useState(0);
```

The parent passes the immediate typing state into the filter.

```jsx
<TextSearchFilter
  value={searchInput}
  onChange={setSearchInput}
  onSearch={(value) => {
    setSearchQuery(value);
    setOffset(0);
  }}
  placeholder={`Search ${selectedModel.title.toLowerCase()}...`}
/>
```

The data hook should use `searchQuery`, not `searchInput`.

```jsx
const {
  rows,
  loading,
} = useCoreModelData(
  selectedModel.endpoint,
  offset,
  searchQuery,
  activeFilters
);
```

### What Each Part Does

```jsx
value={searchInput}
```

Controls what appears inside the input.

```jsx
onChange={setSearchInput}
```

Updates the input immediately while the user types.

```jsx
onSearch={(value) => {
  setSearchQuery(value);
  setOffset(0);
}}
```

Runs after the debounce delay. This updates the actual API search value and resets pagination back to the first page.

```jsx
searchQuery
```

This is the value used by the data-fetching hook.

```jsx
searchInput
```

This is only the visible input value.

## Correct Usage Example

```jsx
const [searchInput, setSearchInput] = useState("");
const [searchQuery, setSearchQuery] = useState("");
const [offset, setOffset] = useState(0);

const {
  rows,
  loading,
} = useCoreModelData(
  selectedModel.endpoint,
  offset,
  searchQuery,
  activeFilters
);

<TextSearchFilter
  value={searchInput}
  onChange={setSearchInput}
  onSearch={(value) => {
    setSearchQuery(value);
    setOffset(0);
  }}
  placeholder={`Search ${selectedModel.title.toLowerCase()}...`}
/>
```

## Incorrect Usage Example

Do not use the same state for both `value` and `onSearch`.

```jsx
const [searchQuery, setSearchQuery] = useState("");

<TextSearchFilter
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={(value) => {
    setSearchQuery(value);
    setOffset(0);
  }}
/>
```

This is incorrect because `setSearchQuery` runs immediately when typing.

If `searchQuery` is passed into the data-fetching hook, the request will fire on every keypress.

## Example Workflow

```text
User types into search input
    ↓
onChange updates searchInput immediately
    ↓
TextSearchFilter starts debounce timer
    ↓
User continues typing
    ↓
Previous timer is cancelled
    ↓
User stops typing
    ↓
Delay completes
    ↓
onSearch updates searchQuery
    ↓
API hook receives new searchQuery
    ↓
Filtered results refresh
```

## Controlled Component Behaviour

`TextSearchFilter` is a controlled component.

This means:

- parent components own the state
- input value is passed through props
- all updates occur externally
- the component does not decide what data is fetched

This improves:

- orchestration control
- reset workflows
- synchronization with filters and pagination
- reusable search behaviour across different pages

## Resetting Search

When resetting filters or changing model/resource type, reset both search states:

```jsx
setSearchInput("");
setSearchQuery("");
setOffset(0);
```

This clears the visible input and also clears the active API search query.

## Key Rule

Always remember:

```text
Do not let the API listen directly to the live input value.
```

Use:

```text
Input state first.
Debounced search state second.
API listens to debounced search state.
```
