# searchInput

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why searchInput Exists](#why-searchinput-exists)
- [Immediate User Input State](#immediate-user-input-state)
- [Relationship With TextSearchFilter](#relationship-with-textsearchfilter)
- [Relationship With searchQuery](#relationship-with-searchquery)
- [Why searchInput and searchQuery Are Separate](#why-searchinput-and-searchquery-are-separate)
- [Example Implementation](#example-implementation)
- [Workflow](#workflow)

## Purpose

`searchInput` stores the current value being typed by the user.

It represents the live contents of the search input field.

Example:

```text
User types:
mathematics
```

As each character is entered:

```text
m
ma
mat
math
mathe
...
```

`searchInput` updates immediately.

## Why searchInput Exists

The dashboard separates:

```text
Typing state
```

from:

```text
Search state
```

This prevents API requests from being triggered on every keystroke.

Without this separation:

```text
Every key press
        ↓
API request
```

which creates unnecessary requests and rerenders.

## Immediate User Input State

Typical state:

```js
const [searchInput, setSearchInput] =
  useState("");
```

This state updates immediately as the user types.

Example:

```js
onChange(event.target.value);
```

This creates a responsive typing experience.

## Relationship With TextSearchFilter

`TextSearchFilter` displays and updates `searchInput`.

Example:

```jsx
<TextSearchFilter
  value={searchInput}
  onChange={setSearchInput}
  onSearch={handleSearch}
/>
```

The component displays:

```js
value={searchInput}
```

and updates:

```js
setSearchInput(...)
```

The input component itself does not own the state.

The dashboard owns it.

## Relationship With searchQuery

`searchInput` is not used directly for API requests.

Instead:

```text
searchInput
        ↓
debounced delay
        ↓
searchQuery
```

Example:

```js
onSearch={(value) => {
  setSearchQuery(value);
}}
```

Only `searchQuery` is passed into:

```js
useCoreModelData()
```

This prevents unnecessary API requests while typing.

## Why searchInput and searchQuery Are Separate

Example:

```text
User types "mathematics"
```

Without separation:

```text
m
ma
mat
math
mathe
...
```

would create:

```text
10 API requests
```

With separation:

```text
searchInput updates
        ↓
user stops typing
        ↓
searchQuery updates
        ↓
1 API request
```

This improves:

```text
Performance
User experience
API efficiency
```

## Example Implementation

```js
const [searchInput, setSearchInput] =
  useState("");

const [searchQuery, setSearchQuery] =
  useState("");
```

Usage:

```jsx
<TextSearchFilter
  value={searchInput}
  onChange={setSearchInput}
  onSearch={(value) => {
    setSearchQuery(value);
    setOffset(0);
  }}
/>
```

## Workflow

```text
User types into TextSearchFilter
        ↓
searchInput updates immediately
        ↓
Input rerenders
        ↓
Debounce timer starts
        ↓
User stops typing
        ↓
onSearch executes
        ↓
searchQuery updates
        ↓
API request triggered
```

## Key Architectural Principle

```text
searchInput stores what the user is typing.

searchQuery stores what the API should search.
```

This separation creates responsive inputs while keeping API requests efficient.