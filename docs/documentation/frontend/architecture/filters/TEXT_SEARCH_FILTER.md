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
- [Delayed Search Behaviour](#delayed-search-behaviour)
- [Usage Example](#usage-example)
- [Example Workflow](#example-workflow)
- [Controlled Component Behaviour](#controlled-component-behaviour)

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
- tracking input changes through controlled props
- triggering delayed search execution
- maintaining consistent search styling across the application

## What It Does Not Do

`TextSearchFilter` does not:
- store search state internally
- fetch data itself
- filter datasets directly
- manage pagination
- know anything about APIs or models

Those responsibilities belong to orchestration components/pages.

## Props

| Prop          | Type     | Purpose                                        |
|---------------|----------|------------------------------------------------|
| `value`       | string   | Current search input value                     |
| `onChange`    | function | Updates the controlled input state             |
| `onSearch`    | function | Executes the delayed search action             |
| `placeholder` | string   | Placeholder text displayed inside the input    |
| `delay`       | number   | Delay time before triggering search execution  |

## Default Props

| Prop           | Default       |
|----------------|---------------|
| `placeholder`  | `"Search..."` |
| `delay`        | `500`         |

## Delayed Search Behaviour

The component uses a debounce-style delay through `useEffect`.

Workflow:
- user types into the input
- input value updates immediately
- component waits for the configured delay
- `onSearch` executes after delay completion
- previous timers are cancelled while typing continues

This reduces:
- unnecessary API requests
- excessive rerenders
- rapid search execution

## Usage Example

```jsx
<TextSearchFilter
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={(value) => {
    setSearchQuery(value);
    setOffset(0);
  }}
  placeholder="Search subjects..."
/>
```

# Example Workflow

```text
User types into search input
    ↓
onChange updates controlled state
    ↓
debounce delay begins
    ↓
typing stops
    ↓
onSearch executes
    ↓
filtered results refresh
```

---

## Controlled Component Behaviour

`TextSearchFilter` is a controlled component.

This means:
- parent components own the state
- input value is passed through props
- all updates occur externally

This improves:
- orchestration control
- reset workflows
- synchronization with filters/pagination
